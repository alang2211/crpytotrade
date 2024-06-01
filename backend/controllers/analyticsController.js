const Order = require('../models/Order');
const UserActivity = require('../models/UserActivity');

exports.getTradingVolume = async (req, res) => {
    try {
        const volume = await Order.aggregate([
            { $match: { userId: req.user.id, status: 'executed' } },
            { $group: { _id: "$asset", totalAmount: { $sum: "$amount" } } }
        ]);

        res.json(volume);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getActivityLog = async (req, res) => {
    try {
        const activity = await UserActivity.find({ userId: req.user.id });
        res.json(activity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
