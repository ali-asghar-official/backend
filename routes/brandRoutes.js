const express = require('express');
const Brand = require('../Brand');

const router = express.Router();

router.post('/add', async (req, res) => {
  const title = req.body.title;
  const file = req.body.file;

  const newBrand = new Brand({
    title: title,
    image: file,
  });
  const savedBrand = await newBrand.save();
  res.status(201).json({ message: 'Brand Created' });
});

router.get('/receive', async (req, res) => {
  const list = await Brand.find();
  res.status(200).json({ list });
});

router.get('/list', async (req, res) => {
  const list = await Brand.find();
  res.status(200).json({ list });
});

router.delete('/delete', async (req, res) => {
  const id = req.query.id;
  await Brand.findByIdAndDelete(id);
  res.status(200).json({ message: 'Brand Deleted' });
});

router.get('/single', async (req, res) => {
  const id = req.query.id;
  const findedBrand = await Brand.findById(id);
  res.status(200).json({ findedBrand });
});

router.put('/update', async (req, res) => {
  const id = req.query.id;
  const title = req.body.title;
  const file = req.body.file;

  const findedBrand = await Brand.findById(id);
  if (!findedBrand) return res.status(404).json({ message: 'Brand not found' });
  findedBrand.title = title;
  findedBrand.image = file;
  await findedBrand.save();
  res.status(200).json({ message: 'Brand Updated' });
});

module.exports = router;
