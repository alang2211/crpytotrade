const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, requestPasswordReset, resetPassword, setupTwoFactorAuth, verifyTwoFactorAuth, disableTwoFactorAuth } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { validateUserRegistration } = require('../middleware/validate');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimit');
const router = express.Router();

router.post('/register', registerLimiter, validateUserRegistration, registerUser);
router.post('/login', loginLimiter, loginUser);
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/setup-2fa', auth, setupTwoFactorAuth);
router.post('/verify-2fa', auth, verifyTwoFactorAuth);
router.post('/disable-2fa', auth, disableTwoFactorAuth);

module.exports = router;
