const mongoose = require('mongoose');

const projectProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  completedSteps: {
    type: [Number],
    default: [],
  },
  stepCodes: {
    type: Map,
    of: String,
    default: {},
  },
  lastAccessedStep: {
    type: Number,
    default: 0,
  },
  xpAwarded: {
    type: Boolean,
    default: false,
  },
  totalXpEarned: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

projectProgressSchema.index(
  { userId: 1, projectId: 1 }, 
  { unique: true }
);

module.exports = mongoose.model(
  'ProjectProgress', 
  projectProgressSchema
);
