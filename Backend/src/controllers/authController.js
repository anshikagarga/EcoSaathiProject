const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let tempUsers = [];

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'ecosaathi_secret_key', { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Name, email, and password are required' });
    }
    const safeRole = role === 'Society Admin' ? 'Resident' : (role || 'Resident');
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!process.env.MONGO_URI) {
      const exists = tempUsers.find((u) => u.email === email);
      if (exists) return res.status(400).json({ status: 'error', message: 'User already exists' });
      const newUser = { id: tempUsers.length + 1, name, email, password: hashedPassword, role: safeRole };
      tempUsers.push(newUser);
      return res.status(201).json({
        status: 'success',
        token: generateToken(newUser.id, newUser.role),
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ status: 'error', message: 'User already exists' });
    const user = await User.create({ name, email, password: hashedPassword, role: safeRole });
    res.status(201).json({
      status: 'success',
      token: generateToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }
    if (!process.env.MONGO_URI) {
      const user = tempUsers.find((u) => u.email === email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }
      return res.json({
        status: 'success',
        token: generateToken(user.id, user.role),
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    }
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    res.json({
      status: 'success',
      token: generateToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ status: 'success', user: req.user });
};
