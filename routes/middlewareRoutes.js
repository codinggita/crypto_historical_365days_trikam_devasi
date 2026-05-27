const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { strictLimiter } = require('../middlewares/rateLimiter');
const { sendSuccess } = require('../utils/apiResponse');

router.get('/logger', (req, res) => {
  return sendSuccess(res, { log: 'Check server console log' }, 'Logger middleware test successful');
});

router.get('/auth', protect, (req, res) => {
  return sendSuccess(res, { user: req.user }, 'Auth middleware test successful');
});

router.get('/rate-limit', strictLimiter, (req, res) => {
  return sendSuccess(res, null, 'Rate limit middleware check passed successfully');
});

router.get('/error-handler', (req, res, next) => {
  const error = new Error('Test Error: Mongoose-like Cast Error');
  error.name = 'CastError';
  error.path = 'coin_id';
  error.value = 'invalid-coin-id-format';
  return next(error);
});

module.exports = router;
