const express = require('express');
const Todo = require('../Todo');

const router = express.Router();

router.post('/add', async (req, res) => {
  const title = req.body.title;
  const newTodo = new Todo({ title: title });
  await newTodo.save();
  res.status(201).json({ message: 'Item added successfully' });
});

router.get('/receive', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.json({ message: 'Todo deleted successfully' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const updatedTodo = await Todo.findByIdAndUpdate(id, { title: title }, { new: true });
  res.json({ message: 'Todo updated successfully', todo: updatedTodo });
});

module.exports = router;
