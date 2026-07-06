const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

const app = express();
const PORT = 5001;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/week2_miniproject')
  .then(function() {
    console.log('MongoDB connected successfully for Mini-Project');
    app.listen(PORT, function() {
      console.log('Notes backend running on port ' + PORT);
    });
  })
  .catch(function(err) {
    console.error('Database connection error:', err);
  });
