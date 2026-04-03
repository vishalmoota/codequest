const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Post = require('../models/Post');
const PostComment = require('../models/PostComment');
const User = require('../models/User');

// ─── Helper function to get user rank from XP ───────────────────────────
const getRankFromXP = (xp = 0) => {
  if (xp >= 2000) return 'Diamond';
  if (xp >= 1000) return 'Platinum';
  if (xp >= 500)  return 'Gold';
  if (xp >= 200)  return 'Silver';
  return 'Bronze';
};

// ─── Helper function to get user avatar emoji ──────────────────────────
const getUserAvatar = (user) => {
  if (!user) return '🧑‍💻';
  const avatarMap = {
    explorer: '🧑‍💻',
    coder: '👨‍💻',
    wizard: '🧙‍♂️',
    knight: '⚔️',
    hacker: '🕵️',
    ninja: '🥷',
    robot: '🤖',
    dragon: '🐉'
  };
  return avatarMap[user.avatar?.character] || '🧑‍💻';
};

// ─── GET posts (filtered by channel) ───────────────────────────────────────
router.get('/posts', async (req, res) => {
  try {
    const { channel, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (channel && channel !== 'all') filter.channel = channel;

    const posts = await Post.find(filter)
      .sort({ pinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('author', 'username xp avatar')
      .lean();

    // Enrich posts with proper avatar and rank
    const enrichedPosts = posts.map(post => ({
      ...post,
      authorRank: getRankFromXP(post.author?.xp || 0),
      authorAvatar: getUserAvatar(post.author)
    }));

    const total = await Post.countDocuments(filter);
    res.json({ posts: enrichedPosts, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// ─── CREATE post ────────────────────────────────────────────────────────────
router.post('/posts', protect, async (req, res) => {
  try {
    const { title, body, channel = 'general', tags = [], type = 'discussion' } = req.body;
    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const post = await Post.create({
      title: title.trim().slice(0, 200),
      body: body.trim().slice(0, 5000),
      channel,
      tags: Array.isArray(tags) ? tags : [],
      type,
      author: req.user._id,
      authorName: req.user.username,
      authorAvatar: getUserAvatar(req.user),
      authorRank: getRankFromXP(req.user.xp || 0),
    });

    // Populate author to return full data
    await post.populate('author', 'username xp avatar');

    res.status(201).json({
      ...post.toObject(),
      authorRank: getRankFromXP(req.user.xp || 0),
      authorAvatar: getUserAvatar(req.user)
    });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// ─── GET single post ────────────────────────────────────────────────────────
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username xp avatar')
      .lean();
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    res.json({
      ...post,
      authorRank: getRankFromXP(post.author?.xp || 0),
      authorAvatar: getUserAvatar(post.author)
    });
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

// ─── TOGGLE like on post ────────────────────────────────────────────────────
router.post('/posts/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const idx = post.likes.indexOf(req.user._id);
    if (idx === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(idx, 1);
    }
    await post.save();

    res.json({ likes: post.likes.length, liked: idx === -1 });
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ message: 'Failed to update like' });
  }
});

// ─── GET comments for post ──────────────────────────────────────────────────
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const comments = await PostComment.find({ post: req.params.id })
      .populate('author', 'username xp avatar')
      .sort({ createdAt: 1 })
      .lean();
    
    // Enrich comments with proper avatar and rank
    const enrichedComments = comments.map(comment => ({
      ...comment,
      authorRank: getRankFromXP(comment.author?.xp || 0),
      authorAvatar: getUserAvatar(comment.author)
    }));
    
    res.json(enrichedComments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// ─── ADD comment ────────────────────────────────────────────────────────────
router.post('/posts/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: 'Comment text required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await PostComment.create({
      post: post._id,
      text: text.trim().slice(0, 2000),
      author: req.user._id,
      authorName: req.user.username,
      authorAvatar: getUserAvatar(req.user),
      authorRank: getRankFromXP(req.user.xp || 0),
    });

    post.commentCount = (post.commentCount || 0) + 1;
    await post.save();

    await comment.populate('author', 'username xp avatar');

    res.status(201).json({
      ...comment.toObject(),
      authorRank: getRankFromXP(req.user.xp || 0),
      authorAvatar: getUserAvatar(req.user)
    });
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ message: 'Failed to create comment' });
  }
});

// ─── DELETE comment ─────────────────────────────────────────────────────────
router.delete('/posts/:postId/comments/:commentId', protect, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    
    const comment = await PostComment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await PostComment.deleteOne({ _id: commentId });

    // Decrease comment count on post
    const post = await Post.findById(postId);
    if (post) {
      post.commentCount = Math.max(0, (post.commentCount || 1) - 1);
      await post.save();
    }

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

// ─── DELETE post ────────────────────────────────────────────────────────────
router.delete('/posts/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete all comments for this post
    await PostComment.deleteMany({ post: req.params.id });

    // Delete the post
    await Post.deleteOne({ _id: req.params.id });

    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

// ─── SEARCH posts ───────────────────────────────────────────────────────────
router.get('/search', async (req, res) => {
  try {
    const { q = '', channel, limit = 20 } = req.query;

    if (!q.trim()) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { body: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    if (channel && channel !== 'all') {
      filter.channel = channel;
    }

    const results = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('author', 'username xp avatar')
      .lean();

    const enrichedResults = results.map(post => ({
      ...post,
      authorRank: getRankFromXP(post.author?.xp || 0),
      authorAvatar: getUserAvatar(post.author)
    }));

    res.json(enrichedResults);
  } catch (err) {
    console.error('Error searching posts:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

module.exports = router;
