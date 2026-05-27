const analyticsService = require('../services/analyticsService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const getHighestPrice = asyncHandler(async (req, res) => {
  const result = await analyticsService.getHighestPrice();
  return sendSuccess(res, result, 'Highest price record fetched successfully');
});

const getLowestPrice = asyncHandler(async (req, res) => {
  const result = await analyticsService.getLowestPrice();
  return sendSuccess(res, result, 'Lowest price record fetched successfully');
});

const getAveragePrice = asyncHandler(async (req, res) => {
  const averagePrice = await analyticsService.getAveragePrice();
  return sendSuccess(res, { averagePrice }, 'Average market price fetched successfully');
});

const getPriceHistory = asyncHandler(async (req, res) => {
  const history = await analyticsService.getPriceHistory(req.params.coinId);
  return sendSuccess(res, history, 'Price history records fetched successfully');
});

const getMarketTrend = asyncHandler(async (req, res) => {
  const trend = await analyticsService.getMarketTrend();
  return sendSuccess(res, trend, 'Market monthly trends fetched successfully');
});

const getPriceGrowth = asyncHandler(async (req, res) => {
  const growth = await analyticsService.getPriceGrowth();
  return sendSuccess(res, growth, 'Price growth calculations fetched successfully');
});

const getPriceDrop = asyncHandler(async (req, res) => {
  const drop = await analyticsService.getPriceDrop();
  return sendSuccess(res, drop, 'Price drop calculations fetched successfully');
});

const getHighestVolume = asyncHandler(async (req, res) => {
  const result = await analyticsService.getHighestVolume();
  return sendSuccess(res, result, 'Highest volume records fetched successfully');
});

const getLowestVolume = asyncHandler(async (req, res) => {
  const result = await analyticsService.getLowestVolume();
  return sendSuccess(res, result, 'Lowest volume records fetched successfully');
});

const getAverageVolume = asyncHandler(async (req, res) => {
  const averageVolume = await analyticsService.getAverageVolume();
  return sendSuccess(res, { averageVolume }, 'Average market volume fetched successfully');
});

const getVolumeSpikes = asyncHandler(async (req, res) => {
  const spikes = await analyticsService.getVolumeSpikes();
  return sendSuccess(res, spikes, 'Volume spikes calculated successfully');
});

const getTopReturns = asyncHandler(async (req, res) => {
  const result = await analyticsService.getTopReturns();
  return sendSuccess(res, result, 'Top positive return records fetched successfully');
});

const getNegativeReturns = asyncHandler(async (req, res) => {
  const result = await analyticsService.getNegativeReturns();
  return sendSuccess(res, result, 'Top negative return records fetched successfully');
});

const getCumulativeReturns = asyncHandler(async (req, res) => {
  const returns = await analyticsService.getCumulativeReturns();
  return sendSuccess(res, returns, 'Cumulative returns statistics fetched successfully');
});

const getHighVolatility = asyncHandler(async (req, res) => {
  const result = await analyticsService.getHighVolatility();
  return sendSuccess(res, result, 'High volatility records fetched successfully');
});

module.exports = {
  getHighestPrice,
  getLowestPrice,
  getAveragePrice,
  getPriceHistory,
  getMarketTrend,
  getPriceGrowth,
  getPriceDrop,
  getHighestVolume,
  getLowestVolume,
  getAverageVolume,
  getVolumeSpikes,
  getTopReturns,
  getNegativeReturns,
  getCumulativeReturns,
  getHighVolatility
};
