const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  body:        { type: String, required: true },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName:  { type: String, required: true },
  authorAvatar:{ type: String, default: '🧑‍💻' },
  authorRank:  { type: String, default: 'Bronze' },
  channel:     { type: String, default: 'general' },
  tags:        [{ type: String }],
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  commentCount:{ type: Number, default: 0 },
  pinned:      { type: Boolean, default: false },
  type:        { type: String, enum: ['question', 'showcase', 'discussion', 'meme'], default: 'discussion' },
}, { timestamps: true });

postSchema.index({ channel: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
