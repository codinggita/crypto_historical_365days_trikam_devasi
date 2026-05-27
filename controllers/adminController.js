const coinService = require('../services/coinService');
const authService = require('../services/authService');
const statsService = require('../services/statsService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const getAllCoinsAdmin = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await coinService.getAllCoinsAdmin(req.query);
  return sendPaginated(res, data, page, limit, total, 'Admin: All coin records fetched successfully');
});

const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getAdminDashboardStats();
  return sendSuccess(res, stats, 'Admin dashboard statistics fetched successfully');
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await authService.getAllUsers(req.query);
  return sendPaginated(res, data, page, limit, total, 'Admin: All registered users fetched successfully');
});

module.exports = {
  getAllCoinsAdmin,
  getAdminDashboardStats,
  getAllUsers
};
