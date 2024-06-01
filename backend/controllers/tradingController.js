const Portfolio = require('../models/Portfolio');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { notifyAdmins } = require('./notificationController');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { checkAlerts } = require('./marketAlertController');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const marketData = [
    { id: 1, name: 'Bitcoin', price: 40000 },
    { id: 2, name: 'Ethereum', price: 3000 },
];

wss.on('connection', (ws, req) => {
    const token = req.url.split('token=')[1];

    if (!token) {
        ws.close();
        return;
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        ws.user = decoded.user;
    } catch (err) {
        ws.close();
        return;
    }

    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
    });

    ws.send(JSON.stringify(marketData));

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Function to send notifications to the specific user
const sendNotification = (userId, message) => {
    wss.clients.forEach(client => {
        if (client.user && client.user.id === userId && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'notification', message }));
        }
    });
};

// Simulate market data updates
setInterval(() => {
    marketData[0].price = Math.random() * 100000; // Bitcoin price simulation
    marketData[1].price = Math.random() * 5000; // Ethereum price simulation

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(marketData));
        }
    });

    // Check alerts on market data update
    checkAlerts(marketData);
}, 10000); // Update every 10 seconds

exports.getMarketData = (req, res) => {
    res.json(marketData);
};

exports.placeOrder = async (req, res) => {
    const { orderType, asset, amount, price, orderKind } = req.body;
    const userId = req.user.id;

    try {
        let portfolio = await Portfolio.findOne({ userId });

        if (!portfolio) {
            portfolio = new Portfolio({ userId, assets: [], transactions: [] });
        }

        if (orderKind === 'market') {
            await executeMarketOrder(orderType, asset, amount, portfolio, res);
        } else if (orderKind === 'limit' || orderKind === 'stop') {
            await createPendingOrder(orderType, asset, amount, price, orderKind, userId, res);
        }

        // Notify admins of large transactions
        if (amount > 10000) { // Example threshold
            await notifyAdmins(`Large transaction detected: ${orderType} ${amount} ${asset} at ${price}`);
        }

        // Send real-time notification to the user
        sendNotification(userId, `Your ${orderType} order of ${amount} ${asset} has been placed successfully.`);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const executeMarketOrder = async (orderType, asset, amount, portfolio, res) => {
    const assetIndex = portfolio.assets.findIndex(a => a.asset === asset);

    if (orderType === 'buy') {
        if (assetIndex > -1) {
            portfolio.assets[assetIndex].amount += amount;
        } else {
            portfolio.assets.push({ asset, amount });
        }
    } else if (orderType === 'sell') {
        if (assetIndex > -1 && portfolio.assets[assetIndex].amount >= amount) {
            portfolio.assets[assetIndex].amount -= amount;

            if (portfolio.assets[assetIndex].amount === 0) {
                portfolio.assets.splice(assetIndex, 1);
            }
        } else {
            return res.status(400).json({ msg: 'Insufficient assets to sell' });
        }
    }

    portfolio.transactions.push({
        orderType,
        asset,
        amount,
        price: marketData.find(data => data.name === asset).price, // use current market price
        date: new Date(),
    });

    await portfolio.save();
    res.json({ msg: 'Order executed successfully', portfolio });
};

const createPendingOrder = async (orderType, asset, amount, price, orderKind, userId, res) => {
    const newOrder = new Order({
        userId,
        orderType,
        asset,
        amount,
        price,
        orderKind,
        status: 'pending',
    });

    await newOrder.save();
    res.json({ msg: 'Order placed successfully', order: newOrder });
};

exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
