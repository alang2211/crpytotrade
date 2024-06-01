module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crypto-trading-platform',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret'
};
