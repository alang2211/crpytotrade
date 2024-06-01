const User = require('../models/User');
const Order = require('../models/Order');
const Portfolio = require('../models/Portfolio');
const UserActivity = require('../models/UserActivity');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTradingStats = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            { $group: { _id: "$asset", totalVolume: { $sum: "$amount" }, totalOrders: { $sum: 1 } } }
        ]);
        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.find({ userId: req.params.userId });
        res.json(portfolio);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserActivity = async (req, res) => {
    try {
        const activity = await UserActivity.find({ userId: req.params.userId });
        res.json(activity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
