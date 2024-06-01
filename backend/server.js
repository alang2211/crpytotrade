const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const userRoutes = require('./routes/userRoutes');
const tradingRoutes = require('./routes/tradingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const marketAlertRoutes = require('./routes/marketAlertRoutes');
const errorHandler = require('./middleware/error');
const rateLimiter = require('./middleware/rateLimit');
const logger = require('./middleware/logger');
const activityTracker = require('./middleware/activityTracker');

const app = express();

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(rateLimiter); // Apply the rate limiting middleware

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

app.use(activityTracker);

app.use('/api/users', userRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/alerts', marketAlertRoutes);

app.use(errorHandler);

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});
