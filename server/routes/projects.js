const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Project = require('../models/Project');

// GET all projects (with optional filter)
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search, group } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
    if (group) filter.group = group;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const projects = await Project.find(filter)
      .select('-steps -theory')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single project (full detail with steps)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('completedBy', 'username')
      .populate('likes', '_id');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST toggle like (auth)
router.post('/:id/like', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const idx = project.likes.indexOf(req.user._id);
    if (idx === -1) project.likes.push(req.user._id);
    else project.likes.splice(idx, 1);
    await project.save();
    res.json({ likes: project.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST mark project complete (auth) — awards XP
router.post('/:id/complete', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    if (!project.completedBy.includes(req.user._id)) {
      project.completedBy.push(req.user._id);
      user.xp += project.xpReward;
      await Promise.all([project.save(), user.save()]);
      res.json({ success: true, xpEarned: project.xpReward, totalXP: user.xp, alreadyCompleted: false });
    } else {
      res.json({ success: true, xpEarned: 0, totalXP: user.xp, alreadyCompleted: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
