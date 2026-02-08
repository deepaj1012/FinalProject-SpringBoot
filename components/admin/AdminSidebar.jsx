// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Typography } from '@mui/material';
import { People, VolunteerActivism, Business, Favorite, Dashboard, Home } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const drawerWidth = 280;

const menuItems = [
    { label: 'Overview', path: '/admin', icon: <Dashboard /> },
    { label: 'Students', path: '/admin/students', icon: <People /> },
    { label: 'Volunteers', path: '/admin/volunteers', icon: <VolunteerActivism /> },
    { label: 'NGOs', path: '/admin/ngos', icon: <Business /> },
    { label: 'Donors', path: '/admin/donors', icon: <Favorite /> },
];

const AdminSidebar = () => {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    borderRight: '1px solid rgba(0,0,0,0.05)',
                    background: '#ffffff'
                },
            }}
        >
            <Toolbar sx={{ px: 3, mb: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Favorite sx={{ color: '#4f46e5', fontSize: 32 }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
                        HelpBridge
                    </Typography>
                </Box>
            </Toolbar>
            <Box sx={{ px: 2 }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.path}
                            component={NavLink}
                            to={item.path}
                            end={item.path === '/admin'}
                            sx={{
                                borderRadius: '0.75rem',
                                mb: 0.5,
                                py: 1.5,
                                color: '#6b7280',
                                '&.active': {
                                    backgroundColor: 'rgba(79, 70, 229, 0.08)',
                                    color: '#4f46e5',
                                    '& .MuiListItemIcon-root': { color: '#4f46e5' },
                                    '& .MuiListItemText-primary': { fontWeight: 700 }
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.02)'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 45, color: 'inherit' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
            <Box sx={{ mt: 'auto', p: 3 }}>
                <ListItemButton
                    component={NavLink}
                    to="/"
                    sx={{ borderRadius: '0.75rem', color: '#6b7280' }}
                >
                    <ListItemIcon sx={{ minWidth: 45, color: 'inherit' }}><Home /></ListItemIcon>
                    <ListItemText primary="Back to Home" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
            </Box>
        </Drawer>
    );
};

export default AdminSidebar;
