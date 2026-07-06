const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async function(req, res) {
  try {
    const list = await Product.find({});
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async function(req, res) {
  try {
    const { title, description, price, category } = req.body;
    if (!title || price === undefined) {
      return res.status(400).json({ error: 'Title and price are required' });
    }

    const item = new Product({
      title,
      description: description || "",
      price,
      category: category || "General"
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
