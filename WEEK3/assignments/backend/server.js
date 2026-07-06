require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = 5003;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/upload', uploadRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(function() {
    console.log('MongoDB connected successfully');
    app.listen(PORT, function() {
      console.log('Assignments backend running on port ' + PORT);
    });
  })
  .catch(function(err) {
    console.error('Database connection error:', err);
  });
