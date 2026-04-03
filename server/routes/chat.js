const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

// ─── GET chat messages by room (paginated) ─────────────────────────
router.get('/messages', async (req, res) => {
  try {
    const { room = 'general', page = 1, limit = 50 } = req.query;

    // Validate room
    const validRooms = ['general', 'javascript', 'python', 'project-help', 'react', 'doubts', 'memes'];
    if (!validRooms.includes(room)) {
      return res.status(400).json({ message: 'Invalid room' });
    }

    const messages = await ChatMessage.find({ room })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await ChatMessage.countDocuments({ room });

    res.json({
      messages: messages.reverse(),
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      room
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// ─── GET single message ───────────────────────────────────────────
router.get('/messages/:id', async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.id)
      .populate('userId', 'username avatar xp level');
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch message' });
  }
});

// ─── GET rooms list ───────────────────────────────────────────────
router.get('/rooms', (req, res) => {
  const rooms = [
    { id: 'general', label: 'General', emoji: '💬', desc: 'Anything goes!' },
    { id: 'javascript', label: 'JavaScript', emoji: '🟡', desc: 'JS questions & tips' },
    { id: 'python', label: 'Python', emoji: '🐍', desc: 'Python help & projects' },
    { id: 'project-help', label: 'Project Help', emoji: '🛠️', desc: 'Get unstuck on projects' },
    { id: 'react', label: 'React', emoji: '⚛️', desc: 'React & frontend chat' },
    { id: 'doubts', label: 'Doubts', emoji: '🤔', desc: 'Ask anything!' },
    { id: 'memes', label: 'Memes', emoji: '😂', desc: 'Fun & laughs' },
  ];
  res.json(rooms);
});

// ─── GET room statistics ──────────────────────────────────────────
router.get('/rooms/:room/stats', async (req, res) => {
  try {
    const { room } = req.params;
    
    const validRooms = ['general', 'javascript', 'python', 'project-help', 'react', 'doubts', 'memes'];
    if (!validRooms.includes(room)) {
      return res.status(400).json({ message: 'Invalid room' });
    }

    const total = await ChatMessage.countDocuments({ room });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await ChatMessage.countDocuments({
      room,
      createdAt: { $gte: today }
    });
    const uniqueUsers = await ChatMessage.distinct('username', { room });

    res.json({
      room,
      totalMessages: total,
      messagestoday: todayCount,
      uniqueUsers: uniqueUsers.length,
      userList: uniqueUsers.slice(0, 20)
    });
  } catch (err) {
    console.error('Error fetching room stats:', err);
    res.status(500).json({ message: 'Failed to fetch room stats' });
  }
});

// ─── DELETE message (protected - owner or admin only) ───────────────
router.delete('/messages/:id', protect, async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Allow deletion if user is the author or an admin
    if (message.userId?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this message' });
    }

    await ChatMessage.deleteOne({ _id: req.params.id });
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

// ─── SEARCH messages in a room ─────────────────────────────────────
router.get('/search/:room', async (req, res) => {
  try {
    const { room } = req.params;
    const { q = '', limit = 20 } = req.query;

    const validRooms = ['general', 'javascript', 'python', 'project-help', 'react', 'doubts', 'memes'];
    if (!validRooms.includes(room)) {
      return res.status(400).json({ message: 'Invalid room' });
    }

    if (!q.trim()) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const results = await ChatMessage.find({
      room,
      $or: [
        { text: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json({ room, query: q, results });
  } catch (err) {
    console.error('Error searching messages:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

module.exports = router;
