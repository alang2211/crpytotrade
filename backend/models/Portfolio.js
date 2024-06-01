const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assets: [
        {
            asset: { type: String, required: true },
            amount: { type: Number, required: true },
        },
    ],
    transactions: [
        {
            orderType: { type: String, required: true },
            asset: { type: String, required: true },
            amount: { type: Number, required: true },
            price: { type: Number, required: true },
            date: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
