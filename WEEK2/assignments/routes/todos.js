const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Todo = require('../models/Todo');

const JWT_SECRET = 'mysecretkey';

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

router.get('/', verifyToken, async function(req, res) {
  try {
    const list = await Todo.find({ user: req.userId });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async function(req, res) {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Task text is required' });
    }

    const newTodo = new Todo({
      text,
      user: req.userId
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async function(req, res) {
  try {
    const { text, completed } = req.body;
    const todo = await Todo.findOne({ _id: req.params.id, user: req.userId });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (text !== undefined) todo.text = text;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async function(req, res) {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
