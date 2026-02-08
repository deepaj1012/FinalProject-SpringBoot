// src/components/admin/AdminNavBar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar } from '@mui/material';
import { Notifications, Settings, Logout } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminNavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: { sm: `calc(100% - 280px)` },
                ml: { sm: `280px` },
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                color: '#111827'
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#4f46e5' }}>
                    Admin Panel
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                    <IconButton size="small"><Notifications /></IconButton>
                    <IconButton size="small"><Settings /></IconButton>
                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1 }}>{user?.name || 'Admin User'}</Typography>
                            <Typography variant="caption" color="textSecondary">Super Admin</Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: '#4f46e5', width: 35, height: 35 }}>A</Avatar>
                        <IconButton size="small" color="error" onClick={handleLogout} sx={{ ml: 1 }}><Logout /></IconButton>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AdminNavBar;
