import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';

const SummaryCard = ({ title, count, route, icon, color }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (route) navigate(route);
    };

    return (
        <Card
            onClick={handleClick}
            sx={{
                cursor: route ? 'pointer' : 'default',
                height: '100%',
                borderRadius: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    borderColor: 'transparent',
                    '& .icon-bg': {
                        transform: 'scale(1.1) rotate(5deg)',
                    }
                }
            }}
            elevation={0}
        >
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', minHeight: '220px', justifyContent: 'space-between' }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                            {title}
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: 800, color: '#111827' }}>
                            {count?.total || 0}
                        </Typography>
                        <Box display="flex" gap={2} mt={2}>
                            <Box>
                                <Typography variant="body2" color="success.main" fontWeight="bold">Active: {count?.approved || 0}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="warning.main" fontWeight="bold">Pending: {count?.pending || 0}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Avatar
                        className="icon-bg"
                        sx={{
                            bgcolor: `${color}15`, // 10% opacity
                            color: color,
                            width: 72,
                            height: 72,
                            borderRadius: '1.2rem',
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>

                {route && (
                    <Box
                        sx={{
                            mt: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: color,
                            fontWeight: 700,
                            fontSize: '0.875rem'
                        }}
                    >
                        View Details <ArrowForward sx={{ fontSize: 16 }} />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default SummaryCard;
