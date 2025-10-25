// Debug script: fetch one product from DB, populate category, normalize and print JSON
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../Product');
const Category = require('../Category');

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/userInfo';

function normalizeProduct(doc) {
  const p = doc && doc.toObject ? doc.toObject() : (doc || {});
  if (p.image && typeof p.image === 'string') {
    p.image = p.image.replace(/\\/g, '/').replace(/^\/+/, '');
  }
  if (p.category && typeof p.category === 'string') {
    p.category = { title: p.category };
  }
  // ensure category exists
  if (!p.category || typeof p.category !== 'object') p.category = { title: '-' };
  // convert _id to string
  if (p._id && typeof p._id === 'object' && p._id.toString) p._id = p._id.toString();
  return p;
}

async function main() {
  try {
    console.log('Connecting to', uri);
    await mongoose.connect(uri);
    console.log('Connected. Fetching single product...');

    const p = await Product.findOne().populate('category');
    if (!p) {
      console.log('No product found');
      await mongoose.disconnect();
      return;
    }

    const normalized = normalizeProduct(p);
    console.log('Normalized product:');
    console.dir(normalized, { depth: null });

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

main();
