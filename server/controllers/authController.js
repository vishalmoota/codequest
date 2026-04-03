const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Array of default avatars & colors
const DEFAULT_AVATARS = ['explorer', 'coder', 'wizard', 'knight', 'hacker', 'ninja', 'robot', 'dragon'];
const DEFAULT_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { username, email, password, avatar: avatarChoice } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: 'Username or email already taken' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Use user-selected avatar or assign random
    const selectedAvatar = avatarChoice?.character || DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
    const randomColor = DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];

    const user = await User.create({ 
      username, 
      email, 
      passwordHash,
      avatar: {
        character: selectedAvatar,
        color: randomColor,
        skinTone: 'light'
      }
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      xp: user.xp,
      level: user.level,
      badges: user.badges,
      avatar: user.avatar,
      streak: user.streak,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      xp: user.xp,
      level: user.level,
      badges: user.badges,
      avatar: user.avatar,
      streak: user.streak,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signup, login };
