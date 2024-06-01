const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getNotifications);
router.put('/:id', auth, markAsRead);

module.exports = router;
