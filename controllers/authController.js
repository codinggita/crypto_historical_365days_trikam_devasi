const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  return sendSuccess(res, result, 'User registered successfully', 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body.email, req.body.password);
  return sendSuccess(res, result, 'User logged in successfully', 200);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user._id);
  return sendSuccess(res, null, 'User logged out successfully', 200);
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user._id);
  return sendSuccess(res, user, 'Profile fetched successfully', 200);
});

const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await authService.updateUserProfile(req.user._id, req.body);
  return sendSuccess(res, updatedUser, 'Profile updated successfully', 200);
});

const deleteProfile = asyncHandler(async (req, res) => {
  await authService.deleteUserProfile(req.user._id);
  return sendSuccess(res, null, 'Profile deleted successfully', 200);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const resetToken = await authService.forgotPassword(req.body.email);
  return sendSuccess(res, { resetToken }, 'Password reset token generated successfully', 200);
});

const resetPassword = asyncHandler(async (req, res) => {
  const token = req.body.token || req.params.token || req.query.token;
  if (!token) {
    const error = new Error('Reset token is required');
    error.statusCode = 400;
    throw error;
  }
  await authService.resetPassword(token, req.body.password);
  return sendSuccess(res, null, 'Password reset successfully', 200);
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    const error = new Error('Old and new passwords are required');
    error.statusCode = 400;
    throw error;
  }
  await authService.changePassword(req.user._id, oldPassword, newPassword);
  return sendSuccess(res, null, 'Password changed successfully', 200);
});

const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmail(req.user._id);
  return sendSuccess(res, user, 'Email verified successfully', 200);
});

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail
};
