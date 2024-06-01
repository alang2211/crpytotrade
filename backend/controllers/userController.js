const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config/email');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const crypto = require('crypto');
const { check, validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
    service: config.service,
    auth: {
        user: config.auth.user,
        pass: config.auth.pass,
    },
});

exports.registerUser = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            user = new User({ name, email, password });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = { user: { id: user.id } };
            jwt.sign(payload, config.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });

            const mailOptions = {
                to: user.email,
                from: config.auth.user,
                subject: 'Welcome to CryptoTrade',
                text: `Hi ${user.name},\n\nWelcome to CryptoTrade! We're excited to have you on board.\n\nBest regards,\nCryptoTrade Team`,
            };

            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    console.error('There was an error:', err);
                }
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
];

exports.loginUser = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, token } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            if (user.twoFactorEnabled) {
                const verified = speakeasy.totp.verify({
                    secret: user.twoFactorSecret,
                    encoding: 'base32',
                    token,
                });

                if (!verified) {
                    return res.status(400).json({ msg: 'Invalid two-factor authentication token' });
                }
            }

            const payload = { user: { id: user.id } };
            jwt.sign(payload, config.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
];

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateUserProfile = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.setupTwoFactorAuth = async (req, res) => {
    try {
        const secret = speakeasy.generateSecret();
        const user = await User.findById(req.user.id);
        user.twoFactorSecret = secret.base32;
        await user.save();

        qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
            res.json({ qrCode: data_url, secret: secret.base32 });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.verifyTwoFactorAuth = async (req, res) => {
    const { token } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
        });

        if (verified) {
            user.twoFactorEnabled = true;
            await user.save();
            res.json({ msg: 'Two-factor authentication enabled' });
        } else {
            res.status(400).json({ msg: 'Invalid token' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.disableTwoFactorAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.twoFactorEnabled = false;
        user.twoFactorSecret = null;
        await user.save();
        res.json({ msg: 'Two-factor authentication disabled' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.requestPasswordReset = [
    check('email', 'Please include a valid email').isEmail(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'User not found' });
            }

            const token = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            await user.save();

            const mailOptions = {
                to: user.email,
                from: config.auth.user,
                subject: 'Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://localhost:3000/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };

            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    console.error('There was an error:', err);
                } else {
                    res.status(200).json('Recovery email sent');
                }
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
];

exports.resetPassword = [
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { token, password } = req.body;
        try {
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            });

            if (!user) {
                return res.status(400).json({ msg: 'Password reset token is invalid or has expired' });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();
            res.status(200).json('Password updated');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
];
