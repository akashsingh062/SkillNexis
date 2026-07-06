const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = 5000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/week2_assignments')
  .then(function() {
    console.log('MongoDB connected successfully');
    app.listen(PORT, function() {
      console.log('Server is running on port ' + PORT);
    });
  })
  .catch(function(err) {
    console.error('Database connection error:', err);
  });
