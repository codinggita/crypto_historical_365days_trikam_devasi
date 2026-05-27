const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema(
  {
    coin_id: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    coin_name: {
      type: String,
      required: true,
      index: true
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
    market_cap_rank: {
      type: Number,
      default: null,
      index: true
    },
    timestamp: {
      type: Date,
      required: true,
      index: true
    },
    date: {
      type: String,
      required: true,
      index: true
    },
    price: {
      type: Number,
      default: null,
      min: 0
    },
    market_cap: {
      type: Number,
      default: null
    },
    volume: {
      type: Number,
      default: null
    },
    daily_return: {
      type: Number,
      default: null
    },
    price_ma7: {
      type: Number,
      default: null
    },
    price_ma30: {
      type: Number,
      default: null
    },
    volatility_7d: {
      type: Number,
      default: null
    },
    cumulative_return: {
      type: Number,
      default: null
    },
    month: {
      type: String,
      required: true,
      index: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Compound Indexes
coinSchema.index({ coin_id: 1, date: 1 }, { unique: true });
coinSchema.index({ coin_id: 1, month: 1 });
coinSchema.index({ market_cap_rank: 1, date: 1 });
coinSchema.index({ price: -1 });
coinSchema.index({ volume: -1 });
coinSchema.index({ market_cap: -1 });
coinSchema.index({ daily_return: -1 });

// Text Index for Search
coinSchema.index(
  { coin_name: 'text', symbol: 'text', coin_id: 'text' },
  { weights: { symbol: 10, coin_id: 5, coin_name: 1 } }
);

const Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin;
