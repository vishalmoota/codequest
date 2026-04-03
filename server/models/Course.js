const mongoose = require('mongoose');

// Theory structure for better organization
const theorySchema = new mongoose.Schema({
  title:       { type: String, required: true },
  emoji:       { type: String, default: '📖' },
  description: { type: String },
  
  // Array of main topics like "Variables: var, let & const"
  topics: [{
    name:       { type: String, required: true },
    emoji:      { type: String },
    content:    { type: String, required: true }, // Explanation text
    codeExamples: [{
      title:    { type: String },
      language: { type: String, default: 'javascript' },
      code:     { type: String, required: true },
      explanation: { type: String },
    }],
    keyRules: [{ type: String }], // Array of important rules/points
    subtopics: [{
      name:       { type: String },
      description: { type: String },
      emoji:      { type: String },
      content:    { type: String },
      codeExamples: [{
        title:    { type: String },
        code:     { type: String },
        explanation: { type: String },
      }],
    }],
  }],
  
  // Quick quiz questions
  quickQuiz: [{
    question:  { type: String, required: true },
    options:   [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
  }],
  
  // Reference books and resources
  references: [{
    title:     { type: String, required: true },
    author:    { type: String },
    url:       { type: String },
    emoji:     { type: String, default: '🔗' },
    type:      { type: String, enum: ['book', 'website', 'docs', 'video'], default: 'website' },
  }],
}, { _id: false });

const levelSchema = new mongoose.Schema({
  levelNum:    { type: Number, required: true },
  title:       { type: String, required: true },
  description: { type: String },
  icon:        { type: String, default: '⚡' },
  theory:      theorySchema,
  // Keep legacy theory string for backwards compatibility
  theoryLegacy: { type: String, default: '' },
}, { _id: false });

const courseSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  language:    { type: String, default: 'javascript' },
  levels:      [levelSchema],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
