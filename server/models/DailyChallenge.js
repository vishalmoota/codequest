const mongoose = require('mongoose');

const dailyChallengeSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  xpReward: { type: Number, default: 50 },
  bonusXP: { type: Number, default: 25 }, // Extra XP for first solve
  theme: { type: String, default: 'Daily Challenge' }, // e.g., "Array Tuesday"
  description: { type: String },
  
  // Leaderboard for daily challenge
  completions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedAt: Date,
    attempts: Number,
    timeSpent: Number // in seconds
  }],
}, { timestamps: true });

// Ensure one challenge per day
dailyChallengeSchema.index({ date: 1 }, { unique: true });

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);
