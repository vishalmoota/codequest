const Narrative = require('../models/Narrative');
const User = require('../models/User');

// GET /api/narrative/course/:courseId
const getNarrative = async (req, res) => {
  try {
    const narrative = await Narrative.findOne({ courseId: req.params.courseId });
    if (!narrative) {
      return res.status(404).json({ message: 'Narrative not found' });
    }
    res.json(narrative);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/narrative/course/:courseId/chapter/:chapterNum
const getChapter = async (req, res) => {
  try {
    const { courseId, chapterNum } = req.params;
    const narrative = await Narrative.findOne({ courseId });
    
    if (!narrative) {
      return res.status(404).json({ message: 'Narrative not found' });
    }

    const chapter = narrative.chapters.find(c => c.chapterNum === parseInt(chapterNum));
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json(chapter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/narrative/progress
const updateNarrativeProgress = async (req, res) => {
  try {
    const { chapterNum, stepId, xpEarned } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.narrativeState) {
      user.narrativeState = {};
    }

    const stateKey = `chapter_${chapterNum}_step_${stepId}`;
    user.narrativeState[stateKey] = {
      completed: true,
      completedAt: new Date(),
      xpEarned
    };

    // Update story chapter and storyline progress
    if (chapterNum > user.storyChapter) {
      user.storyChapter = chapterNum;
    }

    // Calculate overall storyline progress (placeholder: simple %)
    user.storylineProgress = Math.min(chapterNum * 20, 100);

    user.xp += xpEarned || 0;
    
    // Level scaling (every 100 XP = 1 level)
    user.level = Math.floor(user.xp / 100) + 1;

    await user.save();

    res.json({
      storyChapter: user.storyChapter,
      storylineProgress: user.storylineProgress,
      xp: user.xp,
      level: user.level
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/narrative/user-progress
const getUserProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      storyChapter: user.storyChapter,
      storylineProgress: user.storylineProgress,
      narrativeState: user.narrativeState,
      xp: user.xp,
      level: user.level
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getNarrative,
  getChapter,
  updateNarrativeProgress,
  getUserProgress
};
