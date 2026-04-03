const mongoose = require('mongoose');

const storyStepSchema = new mongoose.Schema({
  stepId: String,
  title: String,
  narrative: String, // Story text
  characterDialog: String, // NPC/Character speaking
  backdrop: String, // Description of scene
  choices: [{ // Multiple choice path
    text: String,
    nextStepId: String,
    xpReward: Number,
    skillUnlock: String
  }],
  autoContinueStepId: String, // If no choices, auto-continue
  challengesToUnlock: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
  rewards: {
    xp: Number,
    badge: String,
    skillPoints: Number
  }
}, { _id: false });

const storyChapterSchema = new mongoose.Schema({
  chapterNum: { type: Number, required: true },
  title: { type: String, required: true },
  description: String,
  theme: String, // e.g., "The Foundation Quest"
  steps: [storyStepSchema],
  levelRange: { type: String }, // e.g., "Levels 1-2"
  estimatedTime: Number, // in minutes
  difficultyRating: { type: String, enum: ['beginner', 'intermediate', 'advanced'] }
}, { _id: false });

const narrativeSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  setting: String, // e.g., "The Code Kingdom"
  mainCharacter: String, // e.g., "AsyncAdventurer"
  chapters: [storyChapterSchema],
  worldDescription: String, // Lore & world-building
}, { timestamps: true });

module.exports = mongoose.model('Narrative', narrativeSchema);
