const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/auth');

// Apply protection globally to all admin routes
router.use(protect);
router.use(adminOnly);

router.get('/coins', adminController.getAllCoinsAdmin);
router.get('/stats', adminController.getAdminDashboardStats);
router.get('/users', adminController.getAllUsers);

module.exports = router;
