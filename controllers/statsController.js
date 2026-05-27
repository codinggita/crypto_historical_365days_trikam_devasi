const statsService = require('../services/statsService');
const coinService = require('../services/coinService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const getTotalMarketCap = asyncHandler(async (req, res) => {
  const totalMarketCap = await statsService.getTotalMarketCap();
  return sendSuccess(res, { totalMarketCap }, 'Total market cap fetched successfully');
});

const getAveragePrice = asyncHandler(async (req, res) => {
  const averagePrice = await statsService.getAveragePrice();
  return sendSuccess(res, { averagePrice }, 'Average coin price fetched successfully');
});

const getAverageVolume = asyncHandler(async (req, res) => {
  const averageVolume = await statsService.getAverageVolume();
  return sendSuccess(res, { averageVolume }, 'Average market volume fetched successfully');
});

const getHighestMarketCapCoin = asyncHandler(async (req, res) => {
  const coin = await statsService.getHighestMarketCapCoin();
  return sendSuccess(res, coin, 'Highest market cap coin fetched successfully');
});

const getHighestVolumeCoin = asyncHandler(async (req, res) => {
  const coin = await statsService.getHighestVolumeCoin();
  return sendSuccess(res, coin, 'Highest volume coin fetched successfully');
});

const getTopGainers = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getTopGainers(req.query);
  return sendPaginated(res, data, page, limit, total, 'Top gaining coins fetched successfully');
});

const getTopLosers = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getTopLosers(req.query);
  return sendPaginated(res, data, page, limit, total, 'Top losing coins fetched successfully');
});

const getMonthlyAnalysis = asyncHandler(async (req, res) => {
  const analysis = await statsService.getMonthlyAnalysis();
  return sendSuccess(res, analysis, 'Monthly market analysis fetched successfully');
});

const getCoinCount = asyncHandler(async (req, res) => {
  const count = await statsService.getCoinCount();
  return sendSuccess(res, { count }, 'Unique coin count fetched successfully');
});

const getRankDistribution = asyncHandler(async (req, res) => {
  const distribution = await statsService.getRankDistribution();
  return sendSuccess(res, distribution, 'Rank distribution buckets fetched successfully');
});

const getPriceDistribution = asyncHandler(async (req, res) => {
  const distribution = await statsService.getPriceDistribution();
  return sendSuccess(res, distribution, 'Price distribution buckets fetched successfully');
});

const getVolatilityDistribution = asyncHandler(async (req, res) => {
  const distribution = await statsService.getVolatilityDistribution();
  return sendSuccess(res, distribution, 'Volatility distribution buckets fetched successfully');
});

const getMarketSummary = asyncHandler(async (req, res) => {
  const summary = await statsService.getMarketSummary();
  return sendSuccess(res, summary, 'Overall market summary fetched successfully');
});

const getDailyAnalysis = asyncHandler(async (req, res) => {
  const analysis = await statsService.getDailyAnalysis();
  return sendSuccess(res, analysis, 'Daily market analysis fetched successfully');
});

const getYearlyAnalysis = asyncHandler(async (req, res) => {
  const analysis = await statsService.getYearlyAnalysis();
  return sendSuccess(res, analysis, 'Yearly market analysis fetched successfully');
});

module.exports = {
  getTotalMarketCap,
  getAveragePrice,
  getAverageVolume,
  getHighestMarketCapCoin,
  getHighestVolumeCoin,
  getTopGainers,
  getTopLosers,
  getMonthlyAnalysis,
  getCoinCount,
  getRankDistribution,
  getPriceDistribution,
  getVolatilityDistribution,
  getMarketSummary,
  getDailyAnalysis,
  getYearlyAnalysis
};
