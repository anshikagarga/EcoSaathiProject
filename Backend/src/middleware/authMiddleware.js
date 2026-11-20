const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Not authorized, token missing' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ecosaathi_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};

module.exports = { protect };
