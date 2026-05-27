const validateCoinCreate = (req, res, next) => {
  const { coin_id, coin_name, symbol, timestamp, date, month, price, market_cap, volume, market_cap_rank } = req.body;
  const errors = [];

  // Required checks
  if (!coin_id) errors.push('coin_id is required');
  if (!coin_name) errors.push('coin_name is required');
  if (!symbol) errors.push('symbol is required');
  if (!timestamp) errors.push('timestamp is required');
  if (!date) errors.push('date is required');
  if (!month) errors.push('month is required');

  // Format checks
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (date && !dateRegex.test(date)) {
    errors.push('date must be in YYYY-MM-DD format');
  }

  const monthRegex = /^\d{4}-\d{2}$/;
  if (month && !monthRegex.test(month)) {
    errors.push('month must be in YYYY-MM format');
  }

  // Numeric checks
  if (price !== undefined && price !== null && isNaN(Number(price))) {
    errors.push('price must be a number');
  }

  if (market_cap !== undefined && market_cap !== null && isNaN(Number(market_cap))) {
    errors.push('market_cap must be a number');
  }

  if (volume !== undefined && volume !== null && isNaN(Number(volume))) {
    errors.push('volume must be a number');
  }

  if (market_cap_rank !== undefined && market_cap_rank !== null && isNaN(Number(market_cap_rank))) {
    errors.push('market_cap_rank must be a number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim() === '') errors.push('name is required');
  if (!email || email.trim() === '') errors.push('email is required');
  if (!password) errors.push('password is required');

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email && !emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  if (password && password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim() === '') errors.push('email is required');
  if (!password) errors.push('password is required');

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email && !emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  next();
};

module.exports = {
  validateCoinCreate,
  validateRegister,
  validateLogin
};
