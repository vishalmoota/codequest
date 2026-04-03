const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  currentLevel: {
    type: Number,
    default: 1
  },
  theoryCompleted: [{
    type: Number
  }],
  levelsProgress: [{
    levelNum: Number,
    completed: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    completedAt: Date
  }],
  totalChallengesCompleted: {
    type: Number,
    default: 0
  },
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'paused'],
    default: 'in-progress'
  },
  notes: String,
  lastAccessedChallengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  lastAccessedLevel: {
    type: Number
  },
}, {
  timestamps: true
});

// Compound index for efficient queries
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
courseProgressSchema.index({ userId: 1, lastAccessedAt: -1 });

module.exports = mongoose.model('CourseProgress', courseProgressSchema);
