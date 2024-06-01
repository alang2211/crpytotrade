const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    activity: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserActivity', UserActivitySchema);
