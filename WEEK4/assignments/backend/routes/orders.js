const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');

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
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/', verifyToken, async function(req, res) {
  try {
    let list;
    if (req.userRole === 'admin') {
      list = await Order.find({}).populate('user', 'username');
    } else {
      list = await Order.find({ user: req.userId });
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async function(req, res) {
  try {
    const { items, total } = req.body;
    if (!items || items.length === 0 || total === undefined) {
      return res.status(400).json({ error: 'Order items and total are required' });
    }

    const order = new Order({
      items,
      total,
      user: req.userId
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async function(req, res) {
  try {
    const { status } = req.body;
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin role required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status !== undefined) order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
