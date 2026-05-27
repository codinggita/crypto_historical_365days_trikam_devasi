const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 60 seconds.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many login or registration attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 20,
  message: {
    success: false,
    message: 'Too many requests to this resource. Please try again after 60 seconds.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const exportLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 5,
  message: {
    success: false,
    message: 'Too many export or download requests. Please try again after 60 seconds.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  generalLimiter,
  authLimiter,
  strictLimiter,
  exportLimiter
};
