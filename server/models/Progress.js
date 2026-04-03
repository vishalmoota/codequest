const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  courseId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  levelNum:      { type: Number, required: true },
  completed:     { type: Boolean, default: false },
  submittedCode: { type: String },
  completedAt:   { type: Date },
}, { timestamps: true });

progressSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
