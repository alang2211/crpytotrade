import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ResetPassword = () => {
    const router = useRouter();
    const { token } = router.query;

    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/users/reset-password', { token, password });
            setMessage(res.data);
        } catch (error) {
            console.error(error);
            setMessage('Error resetting password');
        }
    };

    return (
        <div>
            <Navbar />
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <label>New Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
