const express = require('express');
const router = express.Router();
const coinController = require('../controllers/coinController');

router.get('/coins', coinController.searchCoins);

module.exports = router;
