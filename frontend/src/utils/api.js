import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getMarketData = async () => {
    try {
        const response = await axios.get(`${API_URL}/trading/market-data`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, userData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, userData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const placeOrder = async (orderData) => {
    try {
        const response = await axios.post(`${API_URL}/trading/order`, orderData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
