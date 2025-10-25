/*
Migration script:
- Converts Product.category from string (title) to Category ObjectId when a matching Category exists.
- Normalizes Product.image path to use forward slashes and ensure it doesn't start with a leading slash (so '/images/...').

Run with:
  node scripts/migrateProducts.js

It will print a summary and not delete anything. Make a DB backup if you care about data.
*/

const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../Product');
const Category = require('../Category');

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/userInfo';

async function main() {
  try {
    console.log('Connecting to:', uri);
    await mongoose.connect(uri);
    console.log('Connected. Scanning products...');

    const products = await Product.find().lean();
    let updated = 0;

    for (const p of products) {
      const updates = {};

      // Normalize image path: replace backslashes with slashes
      if (p.image && typeof p.image === 'string') {
        const normalized = p.image.replace(/\\/g, '/');
        // remove leading slashes to keep it relative (images/...)
        const relative = normalized.replace(/^\/+/, '');
        if (relative !== p.image) updates.image = relative;
      }

      // If category is a string, try to find Category by title and replace with _id
      if (p.category && typeof p.category === 'string') {
        const cat = await Category.findOne({ title: p.category });
        if (cat) {
          updates.category = cat._id;
        }
      }

      if (Object.keys(updates).length > 0) {
        await Product.updateOne({ _id: p._id }, { $set: updates });
        updated++;
        console.log(`Updated product ${p._id}:`, updates);
      }
    }

    console.log(`Done. Products scanned: ${products.length}, updated: ${updated}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Migration error:', err.message || err);
    process.exit(1);
  }
}

main();
