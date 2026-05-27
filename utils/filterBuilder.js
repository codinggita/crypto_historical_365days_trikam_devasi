const buildCoinFilter = (query) => {
  const filter = { isDeleted: false };

  if (query.symbol) {
    filter.symbol = query.symbol.toUpperCase();
  }

  // Handle both rank and market_cap_rank
  if (query.rank) {
    filter.market_cap_rank = parseInt(query.rank, 10);
  } else if (query.market_cap_rank) {
    filter.market_cap_rank = parseInt(query.market_cap_rank, 10);
  }

  if (query.month) {
    filter.month = query.month;
  }

  if (query.date) {
    filter.date = query.date;
  }

  if (query.coin_id) {
    filter.coin_id = query.coin_id.toLowerCase();
  }

  // Price range and exact match
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = parseFloat(query.minPrice);
    if (query.maxPrice) filter.price.$lte = parseFloat(query.maxPrice);
  } else if (query.price) {
    filter.price = parseFloat(query.price);
  }

  // Other numeric direct match
  if (query.volume) {
    filter.volume = parseFloat(query.volume);
  }

  if (query.marketCap) {
    filter.market_cap = parseFloat(query.marketCap);
  } else if (query.market_cap) {
    filter.market_cap = parseFloat(query.market_cap);
  }

  if (query.dailyReturn) {
    filter.daily_return = parseFloat(query.dailyReturn);
  } else if (query.daily_return) {
    filter.daily_return = parseFloat(query.daily_return);
  }

  if (query.volatility) {
    filter.volatility_7d = parseFloat(query.volatility);
  } else if (query.volatility_7d) {
    filter.volatility_7d = parseFloat(query.volatility_7d);
  }

  return filter;
};

const buildSortQuery = (sortParam, order = 'desc') => {
  const sortDir = order.toLowerCase() === 'asc' ? 1 : -1;

  if (!sortParam) {
    return { timestamp: -1 };
  }

  // Key mappings
  const keyMap = {
    price: 'price',
    volume: 'volume',
    marketCap: 'market_cap',
    market_cap: 'market_cap',
    rank: 'market_cap_rank',
    dailyReturn: 'daily_return',
    daily_return: 'daily_return',
    volatility: 'volatility_7d',
    volatility_7d: 'volatility_7d',
    cumulativeReturn: 'cumulative_return',
    cumulative_return: 'cumulative_return',
    timestamp: 'timestamp',
    month: 'month',
    name: 'coin_name'
  };

  const mappedField = keyMap[sortParam] || 'timestamp';
  return { [mappedField]: sortDir };
};

module.exports = {
  buildCoinFilter,
  buildSortQuery
};
