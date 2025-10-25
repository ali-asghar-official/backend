/*
Simple script to list products in the configured MongoDB.
Run with: node scripts/listProducts.js
It uses the same MONGO_URI fallback as the app. Useful to quickly verify whether products exist and which DB is being connected to.
*/

const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../Product');

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/userInfo';

async function main() {
  try {
    console.log('Connecting to:', uri);
    await mongoose.connect(uri);
    console.log('Connected. Counting products...');

    const count = await Product.countDocuments();
    console.log('Products count:', count);

    if (count > 0) {
      const docs = await Product.find().limit(10).lean();
      console.log('Sample documents (up to 10):');
      console.dir(docs, { depth: 4 });
    } else {
      console.log('No products found in the collection.');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error while checking products:', err.message || err);
    process.exit(1);
  }
}

main();
