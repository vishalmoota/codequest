const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  stepNum: { type: Number, required: true },
  title: { type: String, required: true },
  explanation: { type: String, required: true },
  code: { type: String, default: '' },
  language: { type: String, default: 'javascript' },
  hint: { type: String, default: '' },
  diagram: { type: String, default: '' }, // SVG or emoji diagram description
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String, default: '' },
  category: { type: String, enum: ['JavaScript', 'Python', 'HTML', 'React', 'Node.js', 'AI', 'Game', 'Data Science'], required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  tags: [{ type: String }],
  emoji: { type: String, default: '💻' },
  gradient: { type: String, default: 'from-primary-600 to-accent-purple' },
  xpReward: { type: Number, default: 100 },
  estimatedTime: { type: String, default: '30 min' },
  prerequisites: [{ type: String }],
  whatYoullLearn: [{ type: String }],
  theory: { type: String, default: '' }, // Markdown theory content
  steps: [stepSchema],
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  featured: { type: Boolean, default: false },
  group: { type: String, default: 'all' }, // 'beginner', 'ai', 'hackathon', 'all'
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
