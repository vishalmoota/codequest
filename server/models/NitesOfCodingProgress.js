const mongoose = require('mongoose');

const completedDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
  xpAwarded: { type: Number, default: 0 },
}, { _id: false });

const nitesOfCodingProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  startedAt: { type: Date, default: Date.now },
  lastAccessedAt: { type: Date, default: Date.now },
  currentUnlockedDay: { type: Number, default: 1 },
  lastAccessedDay: { type: Number, default: 1 },
  lastCompletedDay: { type: Number, default: 0 },
  completedDays: { type: [completedDaySchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('NitesOfCodingProgress', nitesOfCodingProgressSchema);
