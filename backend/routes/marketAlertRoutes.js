const express = require('express');
const { createAlert, getAlerts, deleteAlert } = require('../controllers/marketAlertController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createAlert);
router.get('/', auth, getAlerts);
router.delete('/:id', auth, deleteAlert);

module.exports = router;
