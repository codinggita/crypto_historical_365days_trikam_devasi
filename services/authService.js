const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_crypto_analytics_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'super_secret_jwt_refresh_key_crypto_analytics_2026',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );

  return { accessToken, refreshToken };
};

const registerUser = async (body) => {
  const { name, email, password, role } = body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    if (userExists.isDeleted) {
      // Re-activate user
      userExists.isDeleted = false;
      userExists.name = name;
      userExists.password = password;
      if (role) userExists.role = role;
      await userExists.save();
      const tokens = generateTokens(userExists);
      userExists.refreshToken = tokens.refreshToken;
      await userExists.save();
      return { user: userExists, ...tokens };
    }
    const error = new Error('User already exists');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });

  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  // Hide password in response
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, ...tokens };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email, isDeleted: false }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, ...tokens };
};

const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  return true;
};

const getUserProfile = async (userId) => {
  const user = await User.findOne({ _id: userId, isDeleted: false });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateUserProfile = async (userId, body) => {
  const allowedUpdates = ['name'];
  const updates = {};
  allowedUpdates.forEach((field) => {
    if (body[field] !== undefined) updates[field] = body[field];
  });

  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    updates,
    { new: true, runValidators: true }
  );

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const deleteUserProfile = async (userId) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { isDeleted: true, refreshToken: null },
    { new: true }
  );
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return true;
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    const error = new Error('User with this email does not exist');
    error.statusCode = 404;
    throw error;
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  return resetToken; // In production, email this token
};

const resetPassword = async (token, password) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
    isDeleted: false
  });

  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.statusCode = 400;
    throw error;
  }

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpiry = null;
  await user.save();

  return true;
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findOne({ _id: userId, isDeleted: false }).select('+password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    const error = new Error('Incorrect current password');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  await user.save();

  return true;
};

const verifyEmail = async (userId) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { isEmailVerified: true },
    { new: true }
  );
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const refreshUserToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('Refresh token is required');
    error.statusCode = 400;
    throw error;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'super_secret_jwt_refresh_key_crypto_analytics_2026'
    );

    const user = await User.findOne({ _id: decoded.id, isDeleted: false }).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      const error = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
  } catch (err) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    throw error;
  }
};

const revokeToken = async (refreshToken) => {
  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  return true;
};

const getAllUsers = async (query) => {
  const { getPagination } = require('../utils/pagination');
  const { page, limit, skip } = getPagination(query);
  const total = await User.countDocuments({ isDeleted: false });
  const data = await User.find({ isDeleted: false }).skip(skip).limit(limit);
  return { data, total, page, limit };
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  refreshUserToken,
  revokeToken,
  getAllUsers
};
