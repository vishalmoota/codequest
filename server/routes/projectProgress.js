const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');
const ProjectProgress = require('../models/ProjectProgress');
const User = require('../models/User');

const execFileAsync = promisify(execFile);

const normalizeStepCodes = (stepCodes) => {
  if (!stepCodes) return {};
  if (stepCodes instanceof Map) {
    return Object.fromEntries(stepCodes.entries());
  }
  if (typeof stepCodes.toObject === 'function') {
    return stepCodes.toObject();
  }
  return stepCodes;
};

const getLatestStepIndex = (stepCodes = {}, completedSteps = []) => {
  const numericStepIndexes = [
    ...Object.keys(stepCodes).map(Number),
    ...completedSteps,
  ].filter((value) => Number.isFinite(value));

  if (numericStepIndexes.length === 0) {
    return 0;
  }

  return Math.max(...numericStepIndexes);
};

const cleanupDirectory = (directoryPath) => {
  try {
    fs.rmSync(directoryPath, { recursive: true, force: true });
  } catch {
    // Ignore cleanup failures.
  }
};

const clampStepIndex = (stepIndex, totalSteps) => {
  if (!Number.isFinite(stepIndex)) return 0;
  if (!Number.isFinite(totalSteps) || totalSteps <= 0) return Math.max(stepIndex, 0);
  return Math.max(0, Math.min(stepIndex, totalSteps - 1));
};

// GET progress for a specific project
router.get('/:projectId', auth, async (req, res) => {
  try {
    let progress = await ProjectProgress.findOne({
      userId: req.user.id,
      projectId: req.params.projectId,
    });
    if (!progress) {
      progress = {
        projectId: req.params.projectId,
        completedSteps: [],
        stepCodes: {},
        lastAccessedStep: 0,
        xpAwarded: false,
        totalXpEarned: 0,
        completed: false,
      };
    }
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all project progress for user (for profile history)
router.get('/', auth, async (req, res) => {
  try {
    const allProgress = await ProjectProgress.find({
      userId: req.user.id,
    }).sort({ updatedAt: -1 });
    res.json(allProgress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST complete a step and award XP
router.post('/:projectId/step', auth, async (req, res) => {
  try {
    const { stepIndex, code, stepXp, totalSteps } = req.body;
    const { projectId } = req.params;

    let progress = await ProjectProgress.findOne({
      userId: req.user.id,
      projectId,
    });

    if (!progress) {
      progress = new ProjectProgress({
        userId: req.user.id,
        projectId,
        completedSteps: [],
        stepCodes: {},
      });
    }

    // Save code for this step
    progress.stepCodes.set(String(stepIndex), code);
    progress.lastAccessedStep = clampStepIndex(
      Number.isFinite(stepIndex) ? stepIndex + 1 : 0,
      totalSteps
    );

    // Award XP for this step only if not already completed
    let xpAwarded = 0;
    if (!progress.completedSteps.includes(stepIndex)) {
      progress.completedSteps.push(stepIndex);
      xpAwarded = stepXp || 15;
      progress.totalXpEarned += xpAwarded;

      // Add XP to user
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { xp: xpAwarded },
      });
    }

    // Check if all steps completed
    if (
      progress.completedSteps.length >= totalSteps &&
      !progress.completed
    ) {
      progress.completed = true;
      progress.completedAt = new Date();
    }

    progress.updatedAt = new Date();
    await progress.save();

    res.json({
      progress,
      xpAwarded,
      message: xpAwarded > 0
        ? `+${xpAwarded} XP earned!`
        : 'Step already completed',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST draft progress without awarding XP
router.post('/:projectId/draft', auth, async (req, res) => {
  try {
    const { stepIndex, code } = req.body;
    const { projectId } = req.params;

    let progress = await ProjectProgress.findOne({
      userId: req.user.id,
      projectId,
    });

    if (!progress) {
      progress = new ProjectProgress({
        userId: req.user.id,
        projectId,
        completedSteps: [],
        stepCodes: {},
        lastAccessedStep: 0,
      });
    }

    if (Number.isFinite(stepIndex)) {
      progress.lastAccessedStep = clampStepIndex(stepIndex, Number.MAX_SAFE_INTEGER);
      progress.stepCodes.set(String(stepIndex), code || '');
    }

    progress.updatedAt = new Date();
    await progress.save();

    res.json({
      progress,
      message: 'Progress saved',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:projectId/download', auth, async (req, res) => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'codequest-project-'));

  try {
    const progress = await ProjectProgress.findOne({
      userId: req.user.id,
      projectId: req.params.projectId,
    });

    if (!progress) {
      cleanupDirectory(tempRoot);
      return res.status(404).json({ message: 'Project progress not found' });
    }

    const stepCodes = normalizeStepCodes(progress.stepCodes);
    const completedSteps = Array.isArray(progress.completedSteps) ? progress.completedSteps : [];
    const latestStepIndex = getLatestStepIndex(stepCodes, completedSteps);
    const sortedStepIndexes = Object.keys(stepCodes)
      .map(Number)
      .filter((value) => Number.isFinite(value))
      .sort((a, b) => a - b);

    const projectDir = path.join(tempRoot, req.params.projectId);
    const stepsDir = path.join(projectDir, 'steps');
    fs.mkdirSync(stepsDir, { recursive: true });

    const finalCode = stepCodes[String(latestStepIndex)] || Object.values(stepCodes).pop() || '';
    fs.writeFileSync(path.join(projectDir, 'index.html'), finalCode, 'utf8');
    fs.writeFileSync(
      path.join(projectDir, 'README.md'),
      `# ${req.params.projectId}\n\nGenerated by CodeQuest Project Tutorials.\n`,
      'utf8'
    );

    sortedStepIndexes.forEach((stepIndex) => {
      fs.writeFileSync(
        path.join(stepsDir, `step-${stepIndex + 1}.html`),
        stepCodes[String(stepIndex)],
        'utf8'
      );
    });

    const zipPath = path.join(tempRoot, `${req.params.projectId}.zip`);
    const compressCommand = `Compress-Archive -Path "${projectDir}\\*" -DestinationPath "${zipPath}" -Force`;
    await execFileAsync('powershell.exe', ['-NoProfile', '-Command', compressCommand]);

    res.download(zipPath, `${req.params.projectId}.zip`, () => {
      cleanupDirectory(tempRoot);
    });
  } catch (error) {
    cleanupDirectory(tempRoot);
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
