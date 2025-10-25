const express = require('express');
const Product = require('../Product');
const Category = require('../Category');
const addProduct = require('../addProduct');

const router = express.Router();

function normalizeProduct(doc) {
  // Accept either a mongoose doc or a plain object
  const p = doc && doc.toObject ? doc.toObject() : (doc || {});

  // Normalize image path: convert backslashes -> forward slashes and drop leading slashes
  if (p.image && typeof p.image === 'string') {
    p.image = p.image.replace(/\\/g, '/').replace(/^\/+/, '');
  }

  // Normalize category: if populated object, leave it; if string, wrap as { title }
  if (p.category && typeof p.category === 'string') {
    p.category = { title: p.category };
  }

  // Ensure category is always an object with a title to avoid frontend crashes
  if (!p.category || typeof p.category !== 'object') {
    p.category = { title: '-' };
  }

  // Convert _id to string for easier consumption by frontends
  if (p._id && typeof p._id === 'object' && p._id.toString) {
    p._id = p._id.toString();
  }

  return p;
}

// Add product (uses addProduct module)
router.post('/add', addProduct);

// List products
router.get('/list', async (req, res) => {
  try {
    const list = await Product.find().populate('category');
    const normalized = list.map(normalizeProduct);
    res.status(200).json({ list: normalized });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Delete product (query id)
router.delete('/delete', async (req, res) => {
  const id = req.query.id;
  await Product.findByIdAndDelete(id);
  res.status(200).json({ message: 'Product Deleted' });
});

// Single product
router.get('/single', async (req, res) => {
  const id = req.query.id;
  const singleProduct = await Product.findById(id).populate('category');
  res.status(200).json({ message: 'success', item: normalizeProduct(singleProduct) });
});

// Category entry (keeps parity with old endpoint)
router.get('/category/entry', async (req, res) => {
  const id = req.query.id;
  const categoryEntry = await Product.findById(id).populate('category');
  res.status(200).json({ message: 'success', item: normalizeProduct(categoryEntry) });
});

// Update product
router.put('/update', async (req, res) => {
  const { name, price, category, brand, detail, preview } = req.body;
  const id = req.query.id;
  const findedProduct = await Product.findById(id);

  if (!findedProduct) return res.status(404).json({ message: 'Product not found' });

  findedProduct.name = name;
  findedProduct.price = price;
  findedProduct.category = category;
  findedProduct.brand = brand;
  findedProduct.detail = detail;
  findedProduct.image = preview ? preview : findedProduct.image;

  await findedProduct.save();
  res.status(200).json({ message: 'Product Updated' });
});

// Products by category
router.get('/by/category', async (req, res) => {
  try {
    const catId = req.query.id;
    const list = await Product.find({ category: catId }).populate('category');
    const normalized = list.map(normalizeProduct);
    res.status(200).json({ list: normalized });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Search products
router.get('/search', async (req, res) => {
  const name = req.query.name || '';
  const list = await Product.find({ name: { $regex: name, $options: 'i' } }).populate('category');
  const normalized = list.map(normalizeProduct);
  res.status(200).json({ message: 'success', list: normalized });
});

// Flexible detail endpoints to support different frontend patterns
// /detail?id=...  or /detail/:id
router.get('/detail', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ message: 'Missing id' });
    const singleProduct = await Product.findById(id).populate('category');
    if (!singleProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'success', item: normalizeProduct(singleProduct) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message || err });
  }
});

router.get('/detail/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const singleProduct = await Product.findById(id).populate('category');
    if (!singleProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'success', item: normalizeProduct(singleProduct) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message || err });
  }
});

module.exports = router;
