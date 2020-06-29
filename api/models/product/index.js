const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  picture: {
    type: String,
    default: null
  },
  slug: {
    type: String,
    default: null
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required']
  },
  weight: {
    type: Number,
    default: 0
  },
  condition: {
    type: Number,
    enum: [0, 1],//0: New, 1: Second
    default: 0,
  },
  notes: {
    type: String,
    default: null
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: (require('../user/index')).collection.name
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  updated_at: {
    type: Date,
    default: null
  }
});

productSchema.statics = {...productSchema.statics, ...(require('./statics'))};
productSchema.plugin(require('./middlewares'));

module.exports = mongoose.model('products', productSchema);
