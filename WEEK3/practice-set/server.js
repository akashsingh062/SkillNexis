require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');

const app = express();
const PORT = 5002;

app.use(express.json());

app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(function() {
    console.log('MongoDB connected successfully');
    app.listen(PORT, function() {
      console.log('User management server running on port ' + PORT);
    });
  })
  .catch(function(err) {
    console.error('Database connection error:', err);
  });
