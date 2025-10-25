const express = require('express');
const UploadFile = require('../UploadFile');

const router = express.Router();

// Expose upload at /upload so mounting at '/image' yields '/image/upload'
router.post('/upload', UploadFile, (req, res) => {
  res.status(201).json({ message: 'success', file: req.file?.path });
});

module.exports = router;
