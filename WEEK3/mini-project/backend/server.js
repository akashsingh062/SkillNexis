require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = 5004;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(function() {
    console.log('MongoDB connected successfully');
    app.listen(PORT, function() {
      console.log('Task Manager backend running on port ' + PORT);
    });
  })
  .catch(function(err) {
    console.error('Database connection error:', err);
  });
