const express = require('express');
const { getTradingVolume, getActivityLog } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/trading-volume', auth, getTradingVolume);
router.get('/activity-log', auth, getActivityLog);

module.exports = router;
