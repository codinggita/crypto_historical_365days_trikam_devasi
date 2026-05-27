const Coin = require('../models/Coin');
const { getPagination } = require('../utils/pagination');
const { buildCoinFilter, buildSortQuery } = require('../utils/filterBuilder');

// Helper to convert empty string to null and parse number fields
const cleanRecordObj = (body) => {
  const numFields = [
    'price',
    'market_cap',
    'volume',
    'daily_return',
    'price_ma7',
    'price_ma30',
    'volatility_7d',
    'cumulative_return',
    'market_cap_rank'
  ];

  const cleaned = { ...body };

  numFields.forEach((field) => {
    if (cleaned[field] === '' || cleaned[field] === undefined) {
      cleaned[field] = null;
    } else if (cleaned[field] !== null) {
      cleaned[field] = Number(cleaned[field]);
    }
  });

  if (cleaned.coin_id) {
    cleaned.coin_id = cleaned.coin_id.toLowerCase();
  }

  if (cleaned.symbol) {
    cleaned.symbol = cleaned.symbol.toUpperCase();
  }

  if (cleaned.timestamp) {
    cleaned.timestamp = new Date(cleaned.timestamp);
  }

  return cleaned;
};

// CRUD Operations
const getAllCoins = async (query) => {
  const filter = buildCoinFilter(query);
  const sort = buildSortQuery(query.sort, query.order);
  const { page, limit, skip } = getPagination(query);

  const total = await Coin.countDocuments(filter);
  const data = await Coin.find(filter).sort(sort).skip(skip).limit(limit);

  return { data, total, page, limit };
};

const getCoinById = async (id) => {
  const coin = await Coin.findOne({ _id: id, isDeleted: false });
  if (!coin) {
    const error = new Error('Coin record not found');
    error.statusCode = 404;
    throw error;
  }
  return coin;
};

const createCoin = async (body) => {
  const cleaned = cleanRecordObj(body);
  return await Coin.create(cleaned);
};

const updateCoin = async (id, body) => {
  const cleaned = cleanRecordObj(body);
  const coin = await Coin.findOneAndUpdate(
    { _id: id, isDeleted: false },
    cleaned,
    { new: true, runValidators: true }
  );
  if (!coin) {
    const error = new Error('Coin record not found');
    error.statusCode = 404;
    throw error;
  }
  return coin;
};

const replaceCoin = async (id, body) => {
  const cleaned = cleanRecordObj(body);
  // Remove _id from replacement body
  delete cleaned._id;
  const coin = await Coin.findOneAndReplace(
    { _id: id, isDeleted: false },
    cleaned,
    { new: true, runValidators: true }
  );
  if (!coin) {
    const error = new Error('Coin record not found');
    error.statusCode = 404;
    throw error;
  }
  return coin;
};

const deleteCoin = async (id) => {
  const coin = await Coin.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  if (!coin) {
    const error = new Error('Coin record not found');
    error.statusCode = 404;
    throw error;
  }
  return true;
};

const coinExists = async (id) => {
  const count = await Coin.countDocuments({ _id: id, isDeleted: false });
  return count > 0;
};

const bulkCreate = async (records) => {
  const cleanedRecords = records.map(cleanRecordObj);
  // ordered: false allows continuing if some items trigger duplicate key errors
  return await Coin.insertMany(cleanedRecords, { ordered: false });
};

const bulkUpdate = async (updates) => {
  const ops = updates.map((item) => {
    const cleaned = cleanRecordObj(item.data);
    return {
      updateOne: {
        filter: { _id: item.id, isDeleted: false },
        update: { $set: cleaned }
      }
    };
  });
  return await Coin.bulkWrite(ops);
};

const bulkDelete = async (ids) => {
  return await Coin.updateMany(
    { _id: { $in: ids }, isDeleted: false },
    { isDeleted: true }
  );
};

// Coin Information Functions
const getCoinByName = async (coinName, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {
    coin_name: { $regex: coinName, $options: 'i' },
    isDeleted: false
  };

  const total = await Coin.countDocuments(filter);
  const data = await Coin.find(filter).skip(skip).limit(limit);

  return { data, total, page, limit };
};

const getCoinBySymbol = async (symbol, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {
    symbol: symbol.toUpperCase(),
    isDeleted: false
  };

  const total = await Coin.countDocuments(filter);
  const data = await Coin.find(filter).skip(skip).limit(limit);

  return { data, total, page, limit };
};

const getCoinByRank = async (rank) => {
  // Returns all history records of the coin at a given market cap rank
  return await Coin.find({ market_cap_rank: parseInt(rank, 10), isDeleted: false }).sort({ date: -1 });
};

const getCoinsByMonth = async (month, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { month, isDeleted: false };

  const total = await Coin.countDocuments(filter);
  const data = await Coin.find(filter).skip(skip).limit(limit);

  return { data, total, page, limit };
};

const getCoinsByDate = async (date) => {
  return await Coin.find({ date, isDeleted: false }).sort({ market_cap_rank: 1 });
};

const getLatestRecords = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const latestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: -1 });
  if (!latestRecord) {
    return { data: [], total: 0, page, limit };
  }

  const filter = { date: latestRecord.date, isDeleted: false };
  const total = await Coin.countDocuments(filter);
  const data = await Coin.find(filter).sort({ market_cap_rank: 1 }).skip(skip).limit(limit);

  return { data, total, page, limit };
};

const getCoinHistory = async (coinId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { coin_id: coinId.toLowerCase(), isDeleted: false };

  const total = await Coin.countDocuments(filter);
  const data = await Coin.find(filter).sort({ timestamp: 1 }).skip(skip).limit(limit);

  return { data, total, page, limit };
};

const getCoinHistoryByMonth = async (coinId, month) => {
  return await Coin.find({
    coin_id: coinId.toLowerCase(),
    month,
    isDeleted: false
  }).sort({ timestamp: 1 });
};

const getTopMarketCap = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const latestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: -1 });
  if (!latestRecord) {
    return { data: [], total: 0, page, limit };
  }

  const filter = {
    date: latestRecord.date,
    market_cap: { $ne: null },
    isDeleted: false
  };

  const total = await Coin.countDocuments(filter);
  const data = await Coin.find(filter).sort({ market_cap: -1 }).skip(skip).limit(limit);

  return { data, total, page, limit };
};

const getTopVolume = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const latestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: -1 });
  if (!latestRecord) {
    return { data: [], total: 0, page, limit };
  }

  const filter = {
    date: latestRecord.date,
    volume: { $ne: null },
    isDeleted: false
  };

  const total = await Coin.countDocuments(filter);
  const data = await Coin.find(filter).sort({ volume: -1 }).skip(skip).limit(limit);

  return { data, total, page, limit };
};

const getTopGainers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const latestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: -1 });
  if (!latestRecord) {
    return { data: [], total: 0, page, limit };
  }

  const filter = {
    date: latestRecord.date,
    daily_return: { $gt: 0 },
    isDeleted: false
  };

  const total = await Coin.countDocuments(filter);
  const data = await Coin.find(filter).sort({ daily_return: -1 }).skip(skip).limit(limit);

  return { data, total, page, limit };
};

const getTopLosers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const latestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: -1 });
  if (!latestRecord) {
    return { data: [], total: 0, page, limit };
  }

  const filter = {
    date: latestRecord.date,
    daily_return: { $lt: 0 },
    isDeleted: false
  };

  const total = await Coin.countDocuments(filter);
  const data = await Coin.find(filter).sort({ daily_return: 1 }).skip(skip).limit(limit);

  return { data, total, page, limit };
};

const getOldestRecords = async () => {
  const oldestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: 1 });
  if (!oldestRecord) return [];
  return await Coin.find({ date: oldestRecord.date, isDeleted: false }).sort({ market_cap_rank: 1 });
};

const getNewestRecords = async (query) => {
  return await getLatestRecords(query);
};

const getTrendingCoins = async (query) => {
  return await getTopVolume(query);
};

const getRecentRecords = async () => {
  return await Coin.find({ isDeleted: false }).sort({ updatedAt: -1 }).limit(50);
};

// Analytics per Coin
const getCoinPerformance = async (coinId) => {
  const result = await Coin.aggregate([
    { $match: { coin_id: coinId.toLowerCase(), isDeleted: false } },
    { $sort: { timestamp: 1 } },
    {
      $group: {
        _id: '$coin_id',
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
        avgVolume: { $avg: '$volume' },
        avgDailyReturn: { $avg: '$daily_return' },
        totalRecords: { $sum: 1 },
        firstPrice: { $first: '$price' },
        latestPrice: { $last: '$price' }
      }
    },
    {
      $project: {
        _id: 0,
        coin_id: '$_id',
        avgPrice: 1,
        maxPrice: 1,
        minPrice: 1,
        avgVolume: 1,
        avgDailyReturn: 1,
        totalRecords: 1,
        firstPrice: 1,
        latestPrice: 1,
        priceChange: { $subtract: ['$latestPrice', '$firstPrice'] },
        priceChangePct: {
          $cond: [
            { $eq: ['$firstPrice', 0] },
            0,
            {
              $multiply: [
                { $divide: [{ $subtract: ['$latestPrice', '$firstPrice'] }, '$firstPrice'] },
                100
              ]
            }
          ]
        }
      }
    }
  ]);

  if (!result || result.length === 0) {
    const error = new Error('No performance history found for this coin');
    error.statusCode = 404;
    throw error;
  }

  return result[0];
};

const getCoinVolatility = async (coinId) => {
  return await Coin.find({
    coin_id: coinId.toLowerCase(),
    volatility_7d: { $ne: null },
    isDeleted: false
  })
    .sort({ timestamp: -1 })
    .select('date month volatility_7d price');
};

const getCoinMarketCap = async (coinId) => {
  return await Coin.find({
    coin_id: coinId.toLowerCase(),
    market_cap: { $ne: null },
    isDeleted: false
  })
    .sort({ timestamp: 1 })
    .select('date month market_cap price');
};

const getCoinVolume = async (coinId) => {
  return await Coin.find({
    coin_id: coinId.toLowerCase(),
    volume: { $ne: null },
    isDeleted: false
  })
    .sort({ timestamp: 1 })
    .select('date month volume price');
};

const getCoinReturns = async (coinId) => {
  return await Coin.find({
    coin_id: coinId.toLowerCase(),
    isDeleted: false
  })
    .sort({ timestamp: 1 })
    .select('date month daily_return cumulative_return price');
};

const getCoinPrice = async (coinId) => {
  const priceRecord = await Coin.findOne({
    coin_id: coinId.toLowerCase(),
    price: { $ne: null },
    isDeleted: false
  })
    .sort({ date: -1 })
    .select('coin_id coin_name symbol price date timestamp');

  if (!priceRecord) {
    const error = new Error('No price record found for this coin');
    error.statusCode = 404;
    throw error;
  }
  return priceRecord;
};

const compareCoins = async (coin1, coin2, coin3 = null) => {
  const matchIds = [coin1.toLowerCase(), coin2.toLowerCase()];
  if (coin3) {
    matchIds.push(coin3.toLowerCase());
  }

  return await Coin.aggregate([
    { $match: { coin_id: { $in: matchIds }, isDeleted: false } },
    {
      $group: {
        _id: '$coin_id',
        coin_name: { $first: '$coin_name' },
        symbol: { $first: '$symbol' },
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
        avgVolume: { $avg: '$volume' },
        avgMarketCap: { $avg: '$market_cap' },
        avgDailyReturn: { $avg: '$daily_return' },
        avgVolatility: { $avg: '$volatility_7d' },
        totalRecords: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        coin_id: '$_id',
        coin_name: 1,
        symbol: 1,
        avgPrice: 1,
        maxPrice: 1,
        minPrice: 1,
        avgVolume: 1,
        avgMarketCap: 1,
        avgDailyReturn: 1,
        avgVolatility: 1,
        totalRecords: 1
      }
    }
  ]);
};

// Search
const searchCoins = async (q, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {
    isDeleted: false,
    $or: [
      { coin_name: { $regex: q, $options: 'i' } },
      { symbol: { $regex: q, $options: 'i' } },
      { coin_id: { $regex: q, $options: 'i' } }
    ]
  };

  const total = await Coin.countDocuments(filter);
  const data = await Coin.find(filter).skip(skip).limit(limit);

  return { data, total, page, limit };
};

// Filter Functions
const getFilteredCoins = async (filterType, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { isDeleted: false };
  let sort = { timestamp: -1 };

  // For all types except missing-values, filter on latest date
  if (filterType !== 'missing-values') {
    const latestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: -1 });
    if (latestRecord) {
      filter.date = latestRecord.date;
    }
  }

  switch (filterType) {
    case 'high-price':
      filter.price = { $ne: null };
      sort = { price: -1 };
      break;
    case 'low-price':
      filter.price = { $ne: null };
      sort = { price: 1 };
      break;
    case 'high-volume':
      filter.volume = { $ne: null };
      sort = { volume: -1 };
      break;
    case 'low-volume':
      filter.volume = { $ne: null };
      sort = { volume: 1 };
      break;
    case 'high-market-cap':
      filter.market_cap = { $ne: null };
      sort = { market_cap: -1 };
      break;
    case 'low-market-cap':
      filter.market_cap = { $ne: null };
      sort = { market_cap: 1 };
      break;
    case 'high-volatility':
      filter.volatility_7d = { $ne: null };
      sort = { volatility_7d: -1 };
      break;
    case 'low-volatility':
      filter.volatility_7d = { $ne: null, $lt: 5 };
      sort = { volatility_7d: 1 };
      break;
    case 'high-return':
      filter.daily_return = { $gt: 5 };
      sort = { daily_return: -1 };
      break;
    case 'negative-return':
      filter.daily_return = { $lt: 0 };
      sort = { daily_return: 1 };
      break;
    case 'bullish':
      filter.daily_return = { $gt: 0 };
      sort = { daily_return: -1 };
      break;
    case 'bearish':
      filter.daily_return = { $lt: 0 };
      sort = { daily_return: 1 };
      break;
    case 'profitable':
      filter.cumulative_return = { $gt: 0 };
      sort = { cumulative_return: -1 };
      break;
    case 'loss-making':
      filter.cumulative_return = { $lt: 0 };
      sort = { cumulative_return: 1 };
      break;
    case 'missing-values':
      filter.$or = [
        { price: null },
        { volume: null },
        { market_cap: null }
      ];
      break;
    default:
      throw new Error(`Invalid filter type: ${filterType}`);
  }

  const total = await Coin.countDocuments(filter);
  const data = await Coin.find(filter).sort(sort).skip(skip).limit(limit);

  return { data, total, page, limit };
};

const getAllCoinsAdmin = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.includeDeleted !== 'true') {
    filter.isDeleted = false;
  }
  const total = await Coin.countDocuments(filter);
  const data = await Coin.find(filter).skip(skip).limit(limit);
  return { data, total, page, limit };
};


const getRandomCoin = async () => {
  const res = await Coin.aggregate([{ $match: { isDeleted: false } }, { $sample: { size: 1 } }]);
  return res[0] || null;
};

const getSmartRecommendations = async () => {
  const latestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: -1 });
  if (!latestRecord) return [];
  return await Coin.find({
    date: latestRecord.date,
    daily_return: { $gt: 1 },
    volatility_7d: { $lt: 8 },
    isDeleted: false
  }).sort({ daily_return: -1 }).limit(5);
};

const getMarketStatus = async () => {
  const statsService = require('./statsService');
  return await statsService.getMarketSummary();
};

const getTopMonthlyPerformers = async () => {
  return await Coin.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$coin_id',
        coin_name: { $first: '$coin_name' },
        symbol: { $first: '$symbol' },
        avgReturn: { $avg: '$daily_return' }
      }
    },
    { $sort: { avgReturn: -1 } },
    { $limit: 5 },
    { $project: { _id: 0, coin_id: '$_id', coin_name: 1, symbol: 1, avgReturn: 1 } }
  ]);
};

const getTopYearlyPerformers = async () => {
  return await Coin.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$coin_id',
        coin_name: { $first: '$coin_name' },
        symbol: { $first: '$symbol' },
        avgReturn: { $avg: '$daily_return' }
      }
    },
    { $sort: { avgReturn: -1 } },
    { $limit: 5 },
    { $project: { _id: 0, coin_id: '$_id', coin_name: 1, symbol: 1, avgReturn: 1 } }
  ]);
};

const getHighVolatilityAlerts = async () => {
  const latestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: -1 });
  if (!latestRecord) return [];
  return await Coin.find({
    date: latestRecord.date,
    volatility_7d: { $gt: 10 },
    isDeleted: false
  }).sort({ volatility_7d: -1 });
};

const getMarketDropAlerts = async () => {
  const latestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: -1 });
  if (!latestRecord) return [];
  return await Coin.find({
    date: latestRecord.date,
    daily_return: { $lt: -5 },
    isDeleted: false
  }).sort({ daily_return: 1 });
};

const getSystemHealth = async () => {
  const mongoose = require('mongoose');
  return {
    status: 'UP',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime()
  };
};

const getSystemVersion = async () => {
  return { version: '1.0.0' };
};

const getSystemConfig = async () => {
  return {
    timezone: 'UTC',
    currency: 'USD',
    rateLimits: {
      general: '100 req/min',
      auth: '10 req/15min'
    }
  };
};

module.exports = {
  cleanRecordObj,
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
  getAllCoinsAdmin,
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
