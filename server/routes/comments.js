const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Comment = require('../models/Comment');

// GET comments for a project
router.get('/:projectId', async (req, res) => {
  try {
    const comments = await Comment.find({ projectId: req.params.projectId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new comment (auth required)
router.post('/:projectId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0)
      return res.status(400).json({ message: 'Comment cannot be empty' });
    if (text.length > 1000)
      return res.status(400).json({ message: 'Comment too long (max 1000 chars)' });

    const User = require('../models/User');
    const user = await User.findById(req.user._id).select('username avatar');

    const comment = new Comment({
      projectId: req.params.projectId,
      userId: req.user._id,
      username: user.username,
      avatar: user.avatar || '🧑‍💻',
      text: text.trim(),
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE own comment (auth)
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await comment.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST like a comment
router.post('/:id/like', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Not found' });
    const idx = comment.likes.indexOf(req.user._id);
    if (idx === -1) comment.likes.push(req.user._id);
    else comment.likes.splice(idx, 1);
    await comment.save();
    res.json({ likes: comment.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
