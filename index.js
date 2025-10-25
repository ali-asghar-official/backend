const express = require('express');
const getConnection = require('./getConnection');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const todoRoutes = require('./routes/todoRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/images', express.static(path.join(__dirname, 'images')));

// mount routers
app.use('/api/users', userRoutes);
app.use('/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/files', fileRoutes);

// Backwards compatibility: mount routes at their old base paths so existing clients keep working
app.use('/product', productRoutes);
app.use('/category', categoryRoutes);
app.use('/brand', brandRoutes);
app.use('/todo', todoRoutes);
app.use('/image', fileRoutes);

getConnection();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
