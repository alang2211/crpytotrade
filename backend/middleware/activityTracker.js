const UserActivity = require('../models/UserActivity');

module.exports = async (req, res, next) => {
    if (req.user) {
        const activity = new UserActivity({
            userId: req.user.id,
            activity: `${req.method} ${req.url}`,
        });

        await activity.save();
    }
    next();
};
