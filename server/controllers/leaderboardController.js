const User = require('../models/User');

// Rank calculation
const getRank = (xp) => {
  if (xp >= 2000) return { name: 'Diamond', icon: '💎', color: '#b9f2ff' };
  if (xp >= 1000) return { name: 'Platinum', icon: '⚜️', color: '#e5e4e2' };
  if (xp >= 500) return { name: 'Gold', icon: '🥇', color: '#ffd700' };
  if (xp >= 200) return { name: 'Silver', icon: '🥈', color: '#c0c0c0' };
  return { name: 'Bronze', icon: '🥉', color: '#cd7f32' };
};

// GET /api/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ xp: -1 })
      .limit(50)
      .select('username xp level badges avatar streak maxStreak achievements');
    const result = users.map(u => ({
      ...u.toObject(),
      rank: getRank(u.xp),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLeaderboard };
