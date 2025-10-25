const express = require('express');
const Category = require('../Category');

const router = express.Router();

// Create category
router.post('/add', async (req, res) => {
  const title = req.body.title;
  const file = req.body.file;

  const newCategory = new Category({
    title: title,
    image: file,
  });
  const savedCategory = await newCategory.save();
  res.status(201).json({ message: 'Category Created' });
});

// Receive/list
router.get('/receive', async (req, res) => {
  const list = await Category.find();
  res.status(200).json({ list });
});

router.get('/list', async (req, res) => {
  const list = await Category.find();
  res.status(200).json({ list });
});

router.get('/single', async (req, res) => {
  const id = req.query.id;
  const findedCat = await Category.findById(id);
  res.status(200).json({ findedCat });
});

router.put('/update', async (req, res) => {
  const id = req.query.id;
  const title = req.body.title;
  const file = req.body.file;

  const findedCat = await Category.findById(id);
  if (!findedCat) return res.status(404).json({ message: 'Category not found' });
  findedCat.title = title;
  findedCat.image = file;
  await findedCat.save();
  res.status(200).json({ message: 'Category Updated' });
});

router.delete('/delete', async (req, res) => {
  const id = req.query.id;
  await Category.findByIdAndDelete(id);
  res.status(200).json({ message: 'Category Deleted' });
});

module.exports = router;
