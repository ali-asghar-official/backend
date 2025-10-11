const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // reference
  brand: String,
  detail: String,
  image: String
});

module.exports = mongoose.model('Product', productSchema);