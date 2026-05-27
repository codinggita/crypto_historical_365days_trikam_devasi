require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./middlewares/logger');
const { generalLimiter } = require('./middlewares/rateLimiter');
const { notFound, globalErrorHandler } = require('./middlewares/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const coinRoutes = require('./routes/coinRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const statsRoutes = require('./routes/statsRoutes');
const jwtRoutes = require('./routes/jwtRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/searchRoutes');
const filterRoutes = require('./routes/filterRoutes');
const middlewareRoutes = require('./routes/middlewareRoutes');

// Connect to Database
connectDB();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(logger);
app.use(generalLimiter);

// Bind Route Handlers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/coins/filter', filterRoutes); // MUST go before coinRoutes to avoid parameter shadowing
app.use('/api/v1/coins', coinRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/jwt', jwtRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/middleware', middlewareRoutes);

// Protected Routes
const { protect } = require('./middlewares/auth');
const { validateCoinCreate } = require('./middlewares/validate');
const coinController = require('./controllers/coinController');
const protectedRouter = express.Router();
protectedRouter.post('/coins', protect, validateCoinCreate, coinController.createCoin);
protectedRouter.patch('/coins/:id', protect, coinController.updateCoin);
protectedRouter.delete('/coins/:id', protect, coinController.deleteCoin);
app.use('/api/v1/protected', protectedRouter);

// Base route info
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Crypto Market Analytics API. Reference /api/v1 for endpoints.'
  });
});

// Favicon handler to avoid browser 404 errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Middleware for Route 404s
app.use(notFound);

// Global Error Handler Middleware
app.use(globalErrorHandler);

// Start Server Listeners
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception Error: ${err.message}`);
  process.exit(1);
});
