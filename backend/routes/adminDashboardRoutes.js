const express = require('express');
const { getAllUsers, getTradingStats, getUserPortfolio, getUserActivity } = require('../controllers/adminDashboardController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

router.get('/users', auth, role('admin'), getAllUsers);
router.get('/stats', auth, role('admin'), getTradingStats);
router.get('/portfolio/:userId', auth, role('admin'), getUserPortfolio);
router.get('/activity/:userId', auth, role('admin'), getUserActivity);

module.exports = router;
