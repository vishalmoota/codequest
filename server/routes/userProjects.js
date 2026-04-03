const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const UserProject = require('../models/UserProject');
const User = require('../models/User');

// GET all projects for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const projects = await UserProject.find({ 
      userId: req.user.id 
    }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single project
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await UserProject.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new project
router.post('/', protect, async (req, res) => {
  try {
    const { title, language } = req.body;
    if (!title || !language) {
      return res.status(400).json({ 
        message: 'Title and language are required' 
      });
    }

    const defaultCode = language === 'python'
      ? '# Write your Python project here\n\nprint("Hello, World!")\n'
      : '// Write your JavaScript project here\n\nconsole.log("Hello, World!");\n';

    const project = new UserProject({
      userId: req.user.id,
      title: title.trim(),
      language,
      code: defaultCode,
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT save project code + award XP on first run
router.put('/:id', protect, async (req, res) => {
  try {
    const { code, lastOutput, incrementRun } = req.body;

    const project = await UserProject.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (code !== undefined) project.code = code;
    if (lastOutput !== undefined) project.lastOutput = lastOutput;
    if (incrementRun) project.runCount += 1;

    // Award 25 XP on first successful run
    let xpAwarded = 0;
    if (incrementRun && !project.xpAwarded) {
      project.xpAwarded = true;
      xpAwarded = 25;
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { xp: 25 },
      });
    }

    project.updatedAt = Date.now();
    await project.save();

    res.json({ project, xpAwarded });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE project
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await UserProject.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
