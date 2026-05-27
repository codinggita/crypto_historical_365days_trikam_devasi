const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const statsController = require('../controllers/statsController');
const { protect, adminOnly } = require('../middlewares/auth');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const authService = require('../services/authService');

router.get('/profile', protect, authController.getProfile);
router.get('/dashboard', protect, adminController.getAdminDashboardStats);

router.post('/generate-token', asyncHandler(async (req, res) => {
  const { id, role, email } = req.body;
  if (!id) {
    const error = new Error('User ID is required to generate mock token');
    error.statusCode = 400;
    throw error;
  }
  const token = jwt.sign(
    { id, role: role || 'user', email: email || 'test@example.com' },
    process.env.JWT_SECRET || 'super_secret_jwt_key_crypto_analytics_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  return sendSuccess(res, { token }, 'Mock token generated successfully');
}));

router.post('/verify-token', asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    const error = new Error('Token is required');
    error.statusCode = 400;
    throw error;
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_crypto_analytics_2026');
  return sendSuccess(res, decoded, 'Token verified successfully');
}));

router.get('/admin', protect, adminOnly, (req, res) => {
  return sendSuccess(res, { message: 'Welcome Admin! This is a secure admin area.' }, 'Admin access confirmed');
});

router.get('/private-stats', protect, statsController.getMarketSummary);

router.post('/refresh-token', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshUserToken(refreshToken);
  return sendSuccess(res, result, 'Token refreshed successfully');
}));

router.delete('/revoke-token', protect, asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await authService.revokeToken(refreshToken);
  return sendSuccess(res, null, 'Token revoked successfully');
}));

module.exports = router;
