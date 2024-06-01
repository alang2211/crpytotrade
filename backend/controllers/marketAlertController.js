const MarketAlert = require('../models/MarketAlert');
const Notification = require('../models/Notification');

exports.createAlert = async (req, res) => {
    const { asset, targetPrice, alertType } = req.body;
    const userId = req.user.id;

    try {
        const newAlert = new MarketAlert({ userId, asset, targetPrice, alertType });
        await newAlert.save();
        res.json({ msg: 'Alert created successfully', alert: newAlert });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAlerts = async (req, res) => {
    try {
        const alerts = await MarketAlert.find({ userId: req.user.id });
        res.json(alerts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteAlert = async (req, res) => {
    try {
        await MarketAlert.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Alert deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Function to check alerts and notify users
exports.checkAlerts = async (marketData) => {
    try {
        const alerts = await MarketAlert.find({ isActive: true });

        for (const alert of alerts) {
            const assetData = marketData.find(data => data.name === alert.asset);
            if (alert.alertType === 'above' && assetData.price >= alert.targetPrice) {
                // Send notification
                const notification = new Notification({
                    userId: alert.userId,
                    message: `The price of ${alert.asset} has gone above ${alert.targetPrice}`,
                });
                await notification.save();

                // Deactivate alert
                alert.isActive = false;
                await alert.save();
            } else if (alert.alertType === 'below' && assetData.price <= alert.targetPrice) {
                // Send notification
                const notification = new Notification({
                    userId: alert.userId,
                    message: `The price of ${alert.asset} has gone below ${alert.targetPrice}`,
                });
                await notification.save();

                // Deactivate alert
                alert.isActive = false;
                await alert.save();
            }
        }
    } catch (err) {
        console.error(err.message);
    }
};
