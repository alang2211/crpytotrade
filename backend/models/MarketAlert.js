const mongoose = require('mongoose');

const MarketAlertSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    asset: { type: String, required: true },
    targetPrice: { type: Number, required: true },
    alertType: { type: String, enum: ['above', 'below'], required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MarketAlert', MarketAlertSchema);
