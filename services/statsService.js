const Coin = require('../models/Coin');

const getLatestDate = async () => {
  const latestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: -1 });
  return latestRecord ? latestRecord.date : null;
};

const getTotalMarketCap = async () => {
  const latestDate = await getLatestDate();
  if (!latestDate) return 0;

  const res = await Coin.aggregate([
    { $match: { date: latestDate, market_cap: { $ne: null }, isDeleted: false } },
    { $group: { _id: null, totalMarketCap: { $sum: '$market_cap' } } }
  ]);
  return res[0] ? res[0].totalMarketCap : 0;
};

const getAveragePrice = async () => {
  const latestDate = await getLatestDate();
  if (!latestDate) return 0;

  const res = await Coin.aggregate([
    { $match: { date: latestDate, price: { $ne: null }, isDeleted: false } },
    { $group: { _id: null, averagePrice: { $avg: '$price' } } }
  ]);
  return res[0] ? res[0].averagePrice : 0;
};

const getAverageVolume = async () => {
  const latestDate = await getLatestDate();
  if (!latestDate) return 0;

  const res = await Coin.aggregate([
    { $match: { date: latestDate, volume: { $ne: null }, isDeleted: false } },
    { $group: { _id: null, averageVolume: { $avg: '$volume' } } }
  ]);
  return res[0] ? res[0].averageVolume : 0;
};

const getHighestMarketCapCoin = async () => {
  const latestDate = await getLatestDate();
  if (!latestDate) return null;

  return await Coin.findOne({ date: latestDate, market_cap: { $ne: null }, isDeleted: false })
    .sort({ market_cap: -1 })
    .select('coin_id coin_name symbol market_cap price date');
};

const getHighestVolumeCoin = async () => {
  const latestDate = await getLatestDate();
  if (!latestDate) return null;

  return await Coin.findOne({ date: latestDate, volume: { $ne: null }, isDeleted: false })
    .sort({ volume: -1 })
    .select('coin_id coin_name symbol volume price date');
};

const getMonthlyAnalysis = async () => {
  return await Coin.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$month',
        avgPrice: { $avg: '$price' },
        avgVolume: { $avg: '$volume' },
        avgMarketCap: { $avg: '$market_cap' },
        avgVolatility: { $avg: '$volatility_7d' },
        recordsCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        month: '$_id',
        avgPrice: 1,
        avgVolume: 1,
        avgMarketCap: 1,
        avgVolatility: 1,
        recordsCount: 1
      }
    }
  ]);
};

const getCoinCount = async () => {
  const res = await Coin.distinct('coin_id', { isDeleted: false });
  return res.length;
};

const getRankDistribution = async () => {
  const latestDate = await getLatestDate();
  if (!latestDate) return [];

  return await Coin.aggregate([
    { $match: { date: latestDate, market_cap_rank: { $ne: null }, isDeleted: false } },
    {
      $bucket: {
        groupBy: '$market_cap_rank',
        boundaries: [1, 11, 51, 101, 500],
        default: 'Other',
        output: {
          count: { $sum: 1 },
          coins: { $push: { coin_id: '$coin_id', symbol: '$symbol', rank: '$market_cap_rank' } }
        }
      }
    }
  ]);
};

const getPriceDistribution = async () => {
  const latestDate = await getLatestDate();
  if (!latestDate) return [];

  return await Coin.aggregate([
    { $match: { date: latestDate, price: { $ne: null }, isDeleted: false } },
    {
      $bucket: {
        groupBy: '$price',
        boundaries: [0, 1, 10, 100, 1000, 1000000],
        default: 'Other',
        output: {
          count: { $sum: 1 },
          avgMarketCap: { $avg: '$market_cap' }
        }
      }
    }
  ]);
};

const getVolatilityDistribution = async () => {
  const latestDate = await getLatestDate();
  if (!latestDate) return [];

  return await Coin.aggregate([
    { $match: { date: latestDate, volatility_7d: { $ne: null }, isDeleted: false } },
    {
      $bucket: {
        groupBy: '$volatility_7d',
        boundaries: [0, 2, 5, 10, 100],
        default: 'Other',
        output: {
          count: { $sum: 1 }
        }
      }
    }
  ]);
};

const getMarketSummary = async () => {
  const latestDate = await getLatestDate();
  if (!latestDate) return null;

  const summary = await Coin.aggregate([
    { $match: { date: latestDate, isDeleted: false } },
    {
      $group: {
        _id: null,
        totalMarketCap: { $sum: '$market_cap' },
        avgPrice: { $avg: '$price' },
        avgVolume: { $avg: '$volume' },
        avgDailyReturn: { $avg: '$daily_return' },
        bullishCount: { $sum: { $cond: [{ $gt: ['$daily_return', 0] }, 1, 0] } },
        bearishCount: { $sum: { $cond: [{ $lt: ['$daily_return', 0] }, 1, 0] } },
        totalCoins: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        date: { $literal: latestDate },
        totalMarketCap: 1,
        avgPrice: 1,
        avgVolume: 1,
        avgDailyReturn: 1,
        bullishCount: 1,
        bearishCount: 1,
        totalCoins: 1,
        marketStatus: {
          $cond: [{ $gt: ['$bullishCount', '$bearishCount'] }, 'Bullish', 'Bearish']
        }
      }
    }
  ]);
  return summary[0] || null;
};

const getDailyAnalysis = async () => {
  return await Coin.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$date',
        avgPrice: { $avg: '$price' },
        avgVolume: { $avg: '$volume' },
        avgMarketCap: { $avg: '$market_cap' },
        bullishCoins: { $sum: { $cond: [{ $gt: ['$daily_return', 0] }, 1, 0] } },
        bearishCoins: { $sum: { $cond: [{ $lt: ['$daily_return', 0] }, 1, 0] } }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 30 },
    {
      $project: {
        _id: 0,
        date: '$_id',
        avgPrice: 1,
        avgVolume: 1,
        avgMarketCap: 1,
        bullishCoins: 1,
        bearishCoins: 1
      }
    }
  ]);
};

const getYearlyAnalysis = async () => {
  return await Coin.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { $substr: ['$date', 0, 4] },
        avgPrice: { $avg: '$price' },
        avgVolume: { $avg: '$volume' },
        avgMarketCap: { $avg: '$market_cap' },
        avgReturn: { $avg: '$daily_return' }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        year: '$_id',
        avgPrice: 1,
        avgVolume: 1,
        avgMarketCap: 1,
        avgReturn: 1
      }
    }
  ]);
};

const getAdminDashboardStats = async () => {
  const User = require('../models/User');
  const totalUsers = await User.countDocuments({ isDeleted: false });
  const totalVerifiedUsers = await User.countDocuments({ isEmailVerified: true, isDeleted: false });
  const totalCoinRecords = await Coin.countDocuments({ isDeleted: false });
  const totalActiveCoins = (await Coin.distinct('coin_id', { isDeleted: false })).length;

  return {
    totalUsers,
    totalVerifiedUsers,
    totalCoinRecords,
    totalActiveCoins,
    systemStatus: 'Healthy',
    timestamp: new Date()
  };
};

module.exports = {
  getLatestDate,
  getTotalMarketCap,
  getAveragePrice,
  getAverageVolume,
  getHighestMarketCapCoin,
  getHighestVolumeCoin,
  getMonthlyAnalysis,
  getCoinCount,
  getRankDistribution,
  getPriceDistribution,
  getVolatilityDistribution,
  getMarketSummary,
  getDailyAnalysis,
  getYearlyAnalysis,
  getAdminDashboardStats
};
