const express = require('express');
const { getMarketData, placeOrder, getOrderHistory } = require('../controllers/tradingController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/market-data', auth, getMarketData);
router.post('/order', auth, placeOrder);
router.get('/order-history', auth, getOrderHistory);

module.exports = router;
