const jwt = require('jsonwebtoken');

// Use an environment variable for the JWT secret in production.
// Falls back to a safe development secret when not provided.
const JWT_SECRET = process.env.JWT_SECRET || 'devSecret';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // expecting "Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user data (id, role) to request
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;