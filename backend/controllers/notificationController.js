const Notification = require('../models/Notification');
const User = require('../models/User');

exports.notifyAdmins = async (message) => {
    try {
        const admins = await User.find({ role: 'admin' });

        for (const admin of admins) {
            const notification = new Notification({
                userId: admin.id,
                message: message,
            });
            await notification.save();
        }
    } catch (err) {
        console.error('Error notifying admins:', err.message);
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id });
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        notification.read = true;
        await notification.save();

        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};