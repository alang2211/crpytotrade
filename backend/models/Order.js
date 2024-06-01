const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderType: { type: String, required: true },
    asset: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    orderKind: { type: String, required: true },
    status: { type: String, default: 'pending' },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
