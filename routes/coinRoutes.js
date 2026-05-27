const express = require('express');
const router = express.Router();
const coinController = require('../controllers/coinController');
const { protect } = require('../middlewares/auth');
const { validateCoinCreate } = require('../middlewares/validate');

// System and health checks
router.get('/system/health', coinController.getSystemHealth);
router.get('/system/version', coinController.getSystemVersion);
router.get('/system/config', coinController.getSystemConfig);

// Advanced analytics and alerts (Must go before /:id)
router.get('/random', coinController.getRandomCoin);
router.get('/recommendations', coinController.getSmartRecommendations);
router.get('/market-status', coinController.getMarketStatus);
router.get('/performance/top-monthly', coinController.getTopMonthlyPerformers);
router.get('/performance/top-yearly', coinController.getTopYearlyPerformers);
router.get('/alerts/high-volatility', coinController.getHighVolatilityAlerts);
router.get('/alerts/market-drop', coinController.getMarketDropAlerts);

// Basic CRUD Operations (Bulk actions must go before generic /:id)
router.post('/bulk-create', protect, coinController.bulkCreate);
router.patch('/bulk-update', protect, coinController.bulkUpdate);
router.delete('/bulk-delete', protect, coinController.bulkDelete);
router.get('/exists/:id', coinController.coinExists);

// Coin Info
router.get('/name/:coinName', coinController.getCoinByName);
router.get('/symbol/:symbol', coinController.getCoinBySymbol);
router.get('/rank/:rank', coinController.getCoinByRank);
router.get('/month/:month', coinController.getCoinsByMonth);
router.get('/date/:date', coinController.getCoinsByDate);
router.get('/latest', coinController.getLatestRecords);
router.get('/recent', coinController.getRecentRecords);

// Analytics
router.get('/performance/:coinId', coinController.getCoinPerformance);
router.get('/volatility/:coinId', coinController.getCoinVolatility);
router.get('/market-cap/:coinId', coinController.getCoinMarketCap);
router.get('/volume/:coinId', coinController.getCoinVolume);
router.get('/returns/:coinId', coinController.getCoinReturns);
router.get('/price/:coinId', coinController.getCoinPrice);
router.get('/compare/:coin1/:coin2', coinController.compareCoins);
router.get('/compare/:coin1/:coin2/:coin3', coinController.compareCoins);
router.get('/history/:coinId', coinController.getCoinHistory);
router.get('/history/:coinId/:month', coinController.getCoinHistoryByMonth);

// Path-based Sorting Routes (e.g. /coins/sort/price/asc)
router.get('/sort/:field/:direction', (req, res, next) => {
  let sortField = req.params.field;
  if (sortField === 'return') sortField = 'daily_return';
  req.query.sort = sortField;
  req.query.order = req.params.direction;
  next();
}, coinController.getAllCoins);

// General CRUD Endpoints
router.route('/')
  .get(coinController.getAllCoins)
  .post(protect, validateCoinCreate, coinController.createCoin);

router.route('/:id')
  .get(coinController.getCoinById)
  .put(protect, validateCoinCreate, coinController.replaceCoin)
  .patch(protect, coinController.updateCoin)
  .delete(protect, coinController.deleteCoin);

module.exports = router;
