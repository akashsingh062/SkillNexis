const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    default: "General"
  }
});

module.exports = mongoose.model('Product', ProductSchema);
