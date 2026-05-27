const coinService = require('../services/coinService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

// CRUD Operations
const getAllCoins = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getAllCoins(req.query);
  return sendPaginated(res, data, page, limit, total, 'Coins fetched successfully');
});

const getCoinById = asyncHandler(async (req, res) => {
  const coin = await coinService.getCoinById(req.params.id);
  return sendSuccess(res, coin, 'Coin record fetched successfully');
});

const createCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.createCoin(req.body);
  return sendSuccess(res, coin, 'Coin record created successfully', 201);
});

const updateCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.updateCoin(req.params.id, req.body);
  return sendSuccess(res, coin, 'Coin record updated successfully');
});

const replaceCoin = asyncHandler(async (req, res) => {
  const coin = await coinService.replaceCoin(req.params.id, req.body);
  return sendSuccess(res, coin, 'Coin record replaced successfully');
});

const deleteCoin = asyncHandler(async (req, res) => {
  await coinService.deleteCoin(req.params.id);
  return sendSuccess(res, null, 'Coin record deleted successfully');
});

const coinExists = asyncHandler(async (req, res) => {
  const exists = await coinService.coinExists(req.params.id);
  return sendSuccess(res, { exists }, 'Existence checked successfully');
});

const bulkCreate = asyncHandler(async (req, res) => {
  const records = Array.isArray(req.body) ? req.body : req.body.records || [];
  const result = await coinService.bulkCreate(records);
  return sendSuccess(res, result, 'Bulk coin records created successfully', 201);
});

const bulkUpdate = asyncHandler(async (req, res) => {
  const updates = Array.isArray(req.body) ? req.body : req.body.updates || [];
  const result = await coinService.bulkUpdate(updates);
  return sendSuccess(res, result, 'Bulk coin records updated successfully');
});

const bulkDelete = asyncHandler(async (req, res) => {
  const ids = Array.isArray(req.body) ? req.body : req.body.ids || [];
  const result = await coinService.bulkDelete(ids);
  return sendSuccess(res, result, 'Bulk coin records deleted successfully');
});

// Coin Information Functions
const getCoinByName = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getCoinByName(req.params.coinName, req.query);
  return sendPaginated(res, data, page, limit, total, 'Coins fetched by name successfully');
});

const getCoinBySymbol = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getCoinBySymbol(req.params.symbol, req.query);
  return sendPaginated(res, data, page, limit, total, 'Coins fetched by symbol successfully');
});

const getCoinByRank = asyncHandler(async (req, res) => {
  const data = await coinService.getCoinByRank(req.params.rank);
  return sendSuccess(res, data, 'Coins fetched by rank successfully');
});

const getCoinsByMonth = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getCoinsByMonth(req.params.month, req.query);
  return sendPaginated(res, data, page, limit, total, 'Coins fetched by month successfully');
});

const getCoinsByDate = asyncHandler(async (req, res) => {
  const data = await coinService.getCoinsByDate(req.params.date);
  return sendSuccess(res, data, 'Coins fetched by date successfully');
});

const getLatestRecords = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getLatestRecords(req.query);
  return sendPaginated(res, data, page, limit, total, 'Latest coin records fetched successfully');
});

const getCoinHistory = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getCoinHistory(req.params.coinId, req.query);
  return sendPaginated(res, data, page, limit, total, 'Coin history fetched successfully');
});

const getCoinHistoryByMonth = asyncHandler(async (req, res) => {
  const data = await coinService.getCoinHistoryByMonth(req.params.coinId, req.params.month);
  return sendSuccess(res, data, 'Coin monthly history fetched successfully');
});

const getTopMarketCap = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getTopMarketCap(req.query);
  return sendPaginated(res, data, page, limit, total, 'Top market cap coins fetched successfully');
});

const getTopVolume = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getTopVolume(req.query);
  return sendPaginated(res, data, page, limit, total, 'Top volume coins fetched successfully');
});

const getTopGainers = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getTopGainers(req.query);
  return sendPaginated(res, data, page, limit, total, 'Top gaining coins fetched successfully');
});

const getTopLosers = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getTopLosers(req.query);
  return sendPaginated(res, data, page, limit, total, 'Top losing coins fetched successfully');
});

const getOldestRecords = asyncHandler(async (req, res) => {
  const data = await coinService.getOldestRecords();
  return sendSuccess(res, data, 'Oldest coin records fetched successfully');
});

const getNewestRecords = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getNewestRecords(req.query);
  return sendPaginated(res, data, page, limit, total, 'Newest coin records fetched successfully');
});

const getTrendingCoins = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getTrendingCoins(req.query);
  return sendPaginated(res, data, page, limit, total, 'Trending coins fetched successfully');
});

const getRecentRecords = asyncHandler(async (req, res) => {
  const data = await coinService.getRecentRecords();
  return sendSuccess(res, data, 'Recent coin records fetched successfully');
});

// Analytics per Coin
const getCoinPerformance = asyncHandler(async (req, res) => {
  const performance = await coinService.getCoinPerformance(req.params.coinId);
  return sendSuccess(res, performance, 'Coin performance fetched successfully');
});

const getCoinVolatility = asyncHandler(async (req, res) => {
  const volatility = await coinService.getCoinVolatility(req.params.coinId);
  return sendSuccess(res, volatility, 'Coin volatility history fetched successfully');
});

const getCoinMarketCap = asyncHandler(async (req, res) => {
  const marketCap = await coinService.getCoinMarketCap(req.params.coinId);
  return sendSuccess(res, marketCap, 'Coin market cap history fetched successfully');
});

const getCoinVolume = asyncHandler(async (req, res) => {
  const volume = await coinService.getCoinVolume(req.params.coinId);
  return sendSuccess(res, volume, 'Coin volume history fetched successfully');
});

const getCoinReturns = asyncHandler(async (req, res) => {
  const returns = await coinService.getCoinReturns(req.params.coinId);
  return sendSuccess(res, returns, 'Coin returns history fetched successfully');
});

const getCoinPrice = asyncHandler(async (req, res) => {
  const price = await coinService.getCoinPrice(req.params.coinId);
  return sendSuccess(res, price, 'Coin current price fetched successfully');
});

const compareCoins = asyncHandler(async (req, res) => {
  const { coin1, coin2, coin3 } = req.params;
  const comparison = await coinService.compareCoins(coin1, coin2, coin3);
  return sendSuccess(res, comparison, 'Coins compared successfully');
});

// Search
const searchCoins = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  const { data, total, page, limit } = await coinService.searchCoins(q, req.query);
  return sendPaginated(res, data, page, limit, total, 'Search results fetched successfully');
});

// Filter
const getFilteredCoins = asyncHandler(async (req, res) => {
  const { filterType } = req.params;
  const { data, total, page, limit } = await coinService.getFilteredCoins(filterType, req.query);
  return sendPaginated(res, data, page, limit, total, `Coins filtered by ${filterType} successfully`);
});

const getRandomCoin = asyncHandler(async (req, res) => {
  const result = await coinService.getRandomCoin();
  return sendSuccess(res, result, 'Random coin record fetched successfully');
});

const getSmartRecommendations = asyncHandler(async (req, res) => {
  const result = await coinService.getSmartRecommendations();
  return sendSuccess(res, result, 'Smart coin recommendations fetched successfully');
});

const getMarketStatus = asyncHandler(async (req, res) => {
  const result = await coinService.getMarketStatus();
  return sendSuccess(res, result, 'Market status fetched successfully');
});

const getTopMonthlyPerformers = asyncHandler(async (req, res) => {
  const result = await coinService.getTopMonthlyPerformers();
  return sendSuccess(res, result, 'Top monthly performers fetched successfully');
});

const getTopYearlyPerformers = asyncHandler(async (req, res) => {
  const result = await coinService.getTopYearlyPerformers();
  return sendSuccess(res, result, 'Top yearly performers fetched successfully');
});

const getHighVolatilityAlerts = asyncHandler(async (req, res) => {
  const result = await coinService.getHighVolatilityAlerts();
  return sendSuccess(res, result, 'High volatility alerts fetched successfully');
});

const getMarketDropAlerts = asyncHandler(async (req, res) => {
  const result = await coinService.getMarketDropAlerts();
  return sendSuccess(res, result, 'Market drop alerts fetched successfully');
});

const getSystemHealth = asyncHandler(async (req, res) => {
  const result = await coinService.getSystemHealth();
  return sendSuccess(res, result, 'System health fetched successfully');
});

const getSystemVersion = asyncHandler(async (req, res) => {
  const result = await coinService.getSystemVersion();
  return sendSuccess(res, result, 'System version fetched successfully');
});

const getSystemConfig = asyncHandler(async (req, res) => {
  const result = await coinService.getSystemConfig();
  return sendSuccess(res, result, 'System config fetched successfully');
});

module.exports = {
  getAllCoins,
  getCoinById,
  createCoin,
  updateCoin,
  replaceCoin,
  deleteCoin,
  coinExists,
  bulkCreate,
  bulkUpdate,
  bulkDelete,
  getCoinByName,
  getCoinBySymbol,
  getCoinByRank,
  getCoinsByMonth,
  getCoinsByDate,
  getLatestRecords,
  getCoinHistory,
  getCoinHistoryByMonth,
  getTopMarketCap,
  getTopVolume,
  getTopGainers,
  getTopLosers,
  getOldestRecords,
  getNewestRecords,
  getTrendingCoins,
  getRecentRecords,
  getCoinPerformance,
  getCoinVolatility,
  getCoinMarketCap,
  getCoinVolume,
  getCoinReturns,
  getCoinPrice,
  compareCoins,
  searchCoins,
  getFilteredCoins,
  getRandomCoin,
  getSmartRecommendations,
  getMarketStatus,
  getTopMonthlyPerformers,
  getTopYearlyPerformers,
  getHighVolatilityAlerts,
  getMarketDropAlerts,
  getSystemHealth,
  getSystemVersion,
  getSystemConfig
};
