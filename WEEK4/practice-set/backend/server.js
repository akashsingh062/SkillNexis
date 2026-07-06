require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const Product = require('./models/Product');

const app = express();
const PORT = 5005;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(function() {
    console.log('MongoDB connected successfully');
    
    Product.countDocuments().then(function(count) {
      if (count === 0) {
        Product.create([
          { title: 'Acoustic Soundbar X', price: 149.99, category: 'Audio', description: 'Surround sound audio bar.' },
          { title: 'ANC Earbuds Solo', price: 99.99, category: 'Audio', description: 'Active noise cancelling wireless earbuds.' },
          { title: 'Condenser Podcast Mic', price: 119.99, category: 'Mics', description: 'Studio USB cardioid microphone.' }
        ]).then(function() {
          console.log('Mock products database populated');
        });
      }
    });

    app.listen(PORT, function() {
      console.log('Practice set backend running on port ' + PORT);
    });
  })
  .catch(function(err) {
    console.error('Database connection error:', err);
  });
