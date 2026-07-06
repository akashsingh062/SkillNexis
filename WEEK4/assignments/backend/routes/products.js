const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

function verifyAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided' });
  }

  const parts = authHeader.split(' ');
  const token = parts[1] || parts[0];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required' });
    }
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/', async function(req, res) {
  try {
    const list = await Product.find({});
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyAdmin, async function(req, res) {
  try {
    const { title, description, price, category, imageUrl } = req.body;
    if (!title || price === undefined) {
      return res.status(400).json({ error: 'Title and price are required' });
    }

    const item = new Product({
      title,
      description: description || "",
      price,
      category: category || "Audio",
      imageUrl: imageUrl || ""
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyAdmin, async function(req, res) {
  try {
    const { title, description, price, category, imageUrl } = req.body;
    const item = await Product.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = price;
    if (category !== undefined) item.category = category;
    if (imageUrl !== undefined) item.imageUrl = imageUrl;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyAdmin, async function(req, res) {
  try {
    const item = await Product.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
