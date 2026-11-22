const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const issueRoutes = require('./routes/issueRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 'error', message: 'Too many requests, please try again later.' }
});
app.use('/api', apiLimiter);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    project: 'EcoSaathi Backend API',
    message: 'EcoSaathi Backend is 100% Fully Working (Phases 1 to 10)! ????',
    availableEndpoints: ['/api/health', '/api/auth/register', '/api/auth/login', '/api/schedules', '/api/issues']
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'EcoSaathi Backend API is healthy, validated, and secured! ????',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/admin/issues', issueRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
