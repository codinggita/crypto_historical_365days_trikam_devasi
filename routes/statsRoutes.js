const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/market-cap', statsController.getTotalMarketCap);
router.get('/average-price', statsController.getAveragePrice);
router.get('/average-volume', statsController.getAverageVolume);
router.get('/highest-market-cap', statsController.getHighestMarketCapCoin);
router.get('/highest-volume', statsController.getHighestVolumeCoin);
router.get('/top-gainers', statsController.getTopGainers);
router.get('/top-losers', statsController.getTopLosers);
router.get('/monthly-analysis', statsController.getMonthlyAnalysis);
router.get('/coin-count', statsController.getCoinCount);
router.get('/rank-distribution', statsController.getRankDistribution);
router.get('/price-distribution', statsController.getPriceDistribution);
router.get('/volatility-distribution', statsController.getVolatilityDistribution);
router.get('/market-summary', statsController.getMarketSummary);
router.get('/daily-analysis', statsController.getDailyAnalysis);
router.get('/yearly-analysis', statsController.getYearlyAnalysis);

module.exports = router;
