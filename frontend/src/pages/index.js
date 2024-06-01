import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';

export default function Home() {
    return (
        <div>
            <Head>
                <title>CryptoTrade</title>
            </Head>
            <Navbar />
            <h1>Welcome to CryptoTrade</h1>
            <p>Your one-stop solution for cryptocurrency trading.</p>
        </div>
    );
}
