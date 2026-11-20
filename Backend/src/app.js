const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issues');

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

app.get('/api/schedules', (req, res) => {
  res.json({
    status: 'success',
    data: [
      { id: 1, wasteType: 'Wet & Dry Waste', collectionDate: 'Mon-Sat', collectionTime: '07:30 AM - 09:30 AM', instructions: 'Keep wet and dry waste in separate bins.' }
    ]
  });
});

app.use('/api/issues', issueRoutes);

module.exports = app;
