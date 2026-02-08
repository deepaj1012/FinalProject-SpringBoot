// src/components/admin/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import AdminNavBar from './AdminNavBar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    return (
        <Box sx={{ display: 'flex', bgcolor: '#f9fafb', minHeight: '100vh' }}>
            <AdminNavBar />
            <AdminSidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 4 },
                    width: { sm: `calc(100% - 280px)` },
                    transition: 'all 0.3s ease'
                }}
            >
                <Toolbar /> {/* Spacer for fixed AppBar */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;


