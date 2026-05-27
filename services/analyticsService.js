const Coin = require('../models/Coin');

const getHighestPrice = async () => {
  return await Coin.findOne({ price: { $ne: null }, isDeleted: false })
    .sort({ price: -1 })
    .select('coin_id coin_name symbol price date timestamp');
};

const getLowestPrice = async () => {
  return await Coin.findOne({ price: { $gt: 0 }, isDeleted: false })
    .sort({ price: 1 })
    .select('coin_id coin_name symbol price date timestamp');
};

const getAveragePrice = async () => {
  const res = await Coin.aggregate([
    { $match: { price: { $ne: null }, isDeleted: false } },
    { $group: { _id: null, averagePrice: { $avg: '$price' } } }
  ]);
  return res[0] ? res[0].averagePrice : 0;
};

const getPriceHistory = async (coinId) => {
  return await Coin.find({ coin_id: coinId.toLowerCase(), isDeleted: false })
    .sort({ timestamp: 1 })
    .select('date month price price_ma7 price_ma30');
};

const getMarketTrend = async () => {
  return await Coin.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$month',
        avgReturn: { $avg: '$daily_return' },
        bullishCount: { $sum: { $cond: [{ $gt: ['$daily_return', 0] }, 1, 0] } },
        bearishCount: { $sum: { $cond: [{ $lt: ['$daily_return', 0] }, 1, 0] } },
        totalRecords: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        month: '$_id',
        avgReturn: 1,
        bullishCount: 1,
        bearishCount: 1,
        totalRecords: 1
      }
    }
  ]);
};

const getPriceGrowth = async () => {
  return await Coin.aggregate([
    { $match: { price: { $ne: null }, isDeleted: false } },
    { $sort: { timestamp: 1 } },
    {
      $group: {
        _id: '$coin_id',
        coin_name: { $first: '$coin_name' },
        symbol: { $first: '$symbol' },
        firstPrice: { $first: '$price' },
        lastPrice: { $last: '$price' }
      }
    },
    {
      $project: {
        _id: 0,
        coin_id: '$_id',
        coin_name: 1,
        symbol: 1,
        firstPrice: 1,
        lastPrice: 1,
        growthPct: {
          $cond: [
            { $eq: ['$firstPrice', 0] },
            0,
            {
              $multiply: [
                { $divide: [{ $subtract: ['$lastPrice', '$firstPrice'] }, '$firstPrice'] },
                100
              ]
            }
          ]
        }
      }
    },
    { $sort: { growthPct: -1 } }
  ]);
};

const getPriceDrop = async () => {
  return await Coin.aggregate([
    { $match: { price: { $ne: null }, isDeleted: false } },
    { $sort: { timestamp: 1 } },
    {
      $group: {
        _id: '$coin_id',
        coin_name: { $first: '$coin_name' },
        symbol: { $first: '$symbol' },
        firstPrice: { $first: '$price' },
        lastPrice: { $last: '$price' }
      }
    },
    {
      $project: {
        _id: 0,
        coin_id: '$_id',
        coin_name: 1,
        symbol: 1,
        firstPrice: 1,
        lastPrice: 1,
        growthPct: {
          $cond: [
            { $eq: ['$firstPrice', 0] },
            0,
            {
              $multiply: [
                { $divide: [{ $subtract: ['$lastPrice', '$firstPrice'] }, '$firstPrice'] },
                100
              ]
            }
          ]
        }
      }
    },
    { $match: { growthPct: { $lt: 0 } } },
    { $sort: { growthPct: 1 } }
  ]);
};

const getHighestVolume = async () => {
  return await Coin.find({ volume: { $ne: null }, isDeleted: false })
    .sort({ volume: -1 })
    .limit(10)
    .select('coin_id coin_name symbol volume date timestamp');
};

const getLowestVolume = async () => {
  return await Coin.find({ volume: { $gt: 0 }, isDeleted: false })
    .sort({ volume: 1 })
    .limit(10)
    .select('coin_id coin_name symbol volume date timestamp');
};

const getAverageVolume = async () => {
  const res = await Coin.aggregate([
    { $match: { volume: { $ne: null }, isDeleted: false } },
    { $group: { _id: null, averageVolume: { $avg: '$volume' } } }
  ]);
  return res[0] ? res[0].averageVolume : 0;
};

const getVolumeSpikes = async () => {
  return await Coin.aggregate([
    { $match: { volume: { $ne: null }, isDeleted: false } },
    {
      $group: {
        _id: '$coin_id',
        coin_name: { $first: '$coin_name' },
        symbol: { $first: '$symbol' },
        avgVolume: { $avg: '$volume' },
        maxVolume: { $max: '$volume' }
      }
    },
    {
      $project: {
        _id: 0,
        coin_id: '$_id',
        coin_name: 1,
        symbol: 1,
        avgVolume: 1,
        maxVolume: 1,
        spikeRatio: {
          $cond: [
            { $eq: ['$avgVolume', 0] },
            0,
            { $divide: ['$maxVolume', '$avgVolume'] }
          ]
        }
      }
    },
    { $match: { spikeRatio: { $gt: 3 } } },
    { $sort: { spikeRatio: -1 } }
  ]);
};

const getTopReturns = async () => {
  const latestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: -1 });
  if (!latestRecord) return [];
  return await Coin.find({
    date: latestRecord.date,
    daily_return: { $gt: 0 },
    isDeleted: false
  })
    .sort({ daily_return: -1 })
    .limit(20);
};

const getNegativeReturns = async () => {
  const latestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: -1 });
  if (!latestRecord) return [];
  return await Coin.find({
    date: latestRecord.date,
    daily_return: { $lt: 0 },
    isDeleted: false
  })
    .sort({ daily_return: 1 })
    .limit(20);
};

const getCumulativeReturns = async () => {
  return await Coin.aggregate([
    { $match: { cumulative_return: { $ne: null }, isDeleted: false } },
    {
      $group: {
        _id: '$coin_id',
        coin_name: { $first: '$coin_name' },
        symbol: { $first: '$symbol' },
        avgCumulativeReturn: { $avg: '$cumulative_return' },
        maxCumulativeReturn: { $max: '$cumulative_return' },
        minCumulativeReturn: { $min: '$cumulative_return' }
      }
    },
    {
      $project: {
        _id: 0,
        coin_id: '$_id',
        coin_name: 1,
        symbol: 1,
        avgCumulativeReturn: 1,
        maxCumulativeReturn: 1,
        minCumulativeReturn: 1
      }
    },
    { $sort: { avgCumulativeReturn: -1 } }
  ]);
};

const getHighVolatility = async () => {
  const latestRecord = await Coin.findOne({ isDeleted: false }).sort({ date: -1 });
  if (!latestRecord) return [];
  return await Coin.find({
    date: latestRecord.date,
    volatility_7d: { $ne: null },
    isDeleted: false
  })
    .sort({ volatility_7d: -1 })
    .limit(20);
};

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
