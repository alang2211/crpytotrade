const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { getAdminData } = require('../controllers/adminController');
const router = express.Router();

router.get('/admin-data', auth, role('admin'), getAdminData);

module.exports = router;
