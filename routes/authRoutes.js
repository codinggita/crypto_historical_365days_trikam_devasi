const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validateRegister, validateLogin } = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/logout', protect, authController.logout);

router.route('/profile')
  .get(protect, authController.getProfile)
  .patch(protect, authController.updateProfile)
  .delete(protect, authController.deleteProfile);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/change-password', protect, authController.changePassword);
router.post('/verify-email', protect, authController.verifyEmail);

module.exports = router;
