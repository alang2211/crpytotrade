import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';

const Trading = () => {
    const [marketData, setMarketData] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:8080');

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('marketData', (data) => {
            setMarketData(data);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Market Data</h1>
            <ul>
                {marketData.map((item) => (
                    <li key={item.id}>{item.name}: {item.price}</li>
                ))}
            </ul>
        </div>
    );
};

export default Trading;
