const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');

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

router.get('/', verifyToken, async function(req, res) {
  try {
    const { status, priority } = req.query;
    const filter = { user: req.userId };

    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    const list = await Task.find(filter);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async function(req, res) {
  try {
    const { title, description, status, priority } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const newTask = new Task({
      title,
      description: description || "",
      status: status || 'Pending',
      priority: priority || 'Medium',
      user: req.userId
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async function(req, res) {
  try {
    const { title, description, status, priority } = req.body;
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async function(req, res) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
