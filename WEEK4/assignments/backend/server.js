require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const Product = require('./models/Product');

const app = express();
const PORT = 5006;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(function() {
    console.log('MongoDB connected successfully');
    
    Product.countDocuments().then(function(count) {
      if (count === 0) {
        Product.create([
          { title: 'Acoustic Soundbar X', price: 149.99, category: 'Audio', description: 'Surround sound audio bar.', imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400' },
          { title: 'ANC Earbuds Solo', price: 99.99, category: 'Audio', description: 'Active noise cancelling wireless earbuds.', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400' },
          { title: 'Condenser Podcast Mic', price: 119.99, category: 'Mics', description: 'Studio USB cardioid microphone.', imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400' }
        ]).then(function() {
          console.log('Mock products database populated');
        });
      }
    });

    app.listen(PORT, function() {
      console.log('Capstone backend running on port ' + PORT);
    });
  })
  .catch(function(err) {
    console.error('Database connection error:', err);
  });
