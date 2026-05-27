const express = require('express');
const router = express.Router();
const coinController = require('../controllers/coinController');

router.get('/:filterType', coinController.getFilteredCoins);

module.exports = router;
