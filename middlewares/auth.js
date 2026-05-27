const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_crypto_analytics_2026');

    // Manual check of token expiry (if not handled automatically)
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    const user = await User.findOne({ _id: decoded.id, isDeleted: false });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found or deleted.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
};

module.exports = {
  protect,
  adminOnly
};
