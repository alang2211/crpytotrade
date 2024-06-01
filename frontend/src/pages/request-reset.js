import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const RequestReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/users/request-reset', { email });
            setMessage(res.data);
        } catch (error) {
            console.error(error);
            setMessage('Error sending reset request');
        }
    };

    return (
        <div>
            <Navbar />
            <h1>Request Password Reset</h1>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RequestReset;
