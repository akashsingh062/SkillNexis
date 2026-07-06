const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided' });
  }

  const parts = authHeader.split(' ');
  const token = parts[1] || parts[0];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/', async function(req, res) {
  try {
    const list = await Post.find({})
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async function(req, res) {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    if (content.trim().length > 300) {
      return res.status(400).json({ error: 'Post content cannot exceed 300 characters' });
    }

    const post = new Post({
      content: content.trim(),
      author: req.userId
    });

    await post.save();
    
    const populated = await Post.findById(post._id).populate('author', 'username');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/like', verifyToken, async function(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const index = post.likes.indexOf(req.userId);
    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    
    const populated = await Post.findById(post._id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/comment', verifyToken, async function(req, res) {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    if (content.trim().length > 150) {
      return res.status(400).json({ error: 'Comment content cannot exceed 150 characters' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      content: content.trim(),
      author: req.userId
    });

    await post.save();
    
    const populated = await Post.findById(post._id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
