const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  xp:    { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: String }],
  
  // Avatar & Personalization
  avatar: {
    character: { type: String, enum: ['explorer', 'coder', 'wizard', 'knight', 'hacker', 'ninja', 'robot', 'dragon'], default: 'explorer' },
    color: { type: String, default: '#6366f1' },
    skinTone: { type: String, default: 'light' }
  },
  
  // Enrolled courses
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  
  // Streak & Daily Challenges
  streak: { type: Number, default: 0 },
  lastChallengeDate: { type: Date },
  currentDayStreak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  
  // Story & Progress
  storyChapter: { type: Number, default: 1 },
  storylineProgress: { type: Number, default: 0 }, // 0-100%
  narrativeState: { type: Object, default: {} }, // Track story choices/state
  
  // Skill Tree
  skills: [{
    skillId: String,
    name: String,
    unlocked: Boolean,
    masteryLevel: { type: Number, default: 0, max: 5 }
  }],
  
  // Social
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reputation: { type: Number, default: 0 },
  
  // Achievements
  achievements: [{
    id: String,
    unlockedAt: Date,
    level: Number
  }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
