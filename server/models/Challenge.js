const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  description: { type: String },
  args:        { type: mongoose.Schema.Types.Mixed },   // arguments passed to solution fn
  expected:    { type: mongoose.Schema.Types.Mixed },   // expected return value
}, { _id: false });

const challengeSchema = new mongoose.Schema({
  courseId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  levelNum:    { type: Number, required: true },
  order:       { type: Number, default: 0 },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  starterCode: { type: String, default: '' },
  testCases:   [testCaseSchema],
  xpReward:    { type: Number, default: 20 },
  functionName:{ type: String, required: true },  // function the user must implement
  
  // Gamification
  difficulty:  { type: String, enum: ['easy', 'medium', 'hard', 'expert'], default: 'medium' },
  storyContext: { type: String, default: '' }, // Narrative explaining the challenge
  hints:       [{ type: String }], // Progressive hints
  timeLimit:   { type: Number, default: 0 }, // minutes, 0 = no limit
  bonusXP:     { type: Number, default: 0 }, // XP for solving within time.
  
  // Metadata
  tags:        [{ type: String }], // e.g., 'arrays', 'recursion', 'string-manipulation'
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
  unlockable:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }], // challenges this unlocks
  
  // Stats
  attemptCount: { type: Number, default: 0 },
  successCount: { type: Number, default: 0 },
  
  // New fields
  language: { 
    type: String, 
    enum: ['javascript', 'python', 'html'], 
    default: 'javascript' 
  },
  exerciseType: { 
    type: String, 
    enum: ['theory', 'coding'], 
    default: 'coding' 
  },
  theoryContent: { 
    type: String, 
    default: '' 
  },
  instructions: { 
    type: String, 
    default: '' 
  },
  expectedOutput: { 
    type: String, 
    default: '' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
