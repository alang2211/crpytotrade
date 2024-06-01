import React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    CryptoTrade
                </Typography>
                <Button color="inherit" component={Link} href="/">Home</Button>
                <Button color="inherit" component={Link} href="/trading">Trading</Button>
                <Button color="inherit" component={Link} href="/request-reset">Request Password Reset</Button>
                <Button color="inherit" component={Link} href="/reset-password">Reset Password</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
