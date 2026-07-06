require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const User = require('./models/User');
const Post = require('./models/Post');

const app = express();
const PORT = 5007;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(function() {
    console.log('MongoDB connected successfully');
    
    Post.countDocuments().then(function(count) {
      if (count === 0) {
        User.findOne().then(function(usr) {
          if (usr) {
            Post.create([
              { content: 'Welcome to the MERN social feed app! Happy capstone week.', author: usr._id }
            ]).then(function() {
              console.log('Mock social posts populated');
            });
          }
        });
      }
    });

    app.listen(PORT, function() {
      console.log('Major-project social backend running on port ' + PORT);
    });
  })
  .catch(function(err) {
    console.error('Database connection error:', err);
  });
