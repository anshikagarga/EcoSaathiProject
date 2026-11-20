const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const issueRoutes = require('./routes/issueRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'EcoSaathi Backend API is healthy and running! ????',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/admin/issues', issueRoutes);

module.exports = app;
