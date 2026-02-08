import React, { useEffect, useState } from 'react';
import { Grid, Box, Alert, Typography, Paper, List, ListItem, ListItemText, Divider, Chip, Avatar } from '@mui/material';
import { History, FlashOn, TrendingUp, Assessment, School, VolunteerActivism, Business, Favorite } from '@mui/icons-material';
import SummaryCard from '../../components/admin/SummaryCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getDashboardSummary, getRecentActivities } from '../../services/adminService';

const AdminDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Note: We don't set loading(true) here to avoid flashing spinner on refresh
                const [summaryData, activitiesData] = await Promise.all([
                    getDashboardSummary(),
                    getRecentActivities()
                ]);
                setSummary(summaryData);
                setActivities(activitiesData);
            } catch (err) {
                console.error("Auto-refresh failed", err);
                // We don't setError here to avoid blocking the UI on transient network errors during poll
                if (loading) setError(err.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        const fetchDebug = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user?.token;
                const res = await fetch('/api/admin/debug', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const text = await res.text();
                setDebugInfo(text);
            } catch (e) {
                // Silent fail on debug info refresh
                console.log('Debug refresh failed', e);
            }
        };

        // First time load
        fetchData();
        fetchDebug();

        // 🔥 AUTO REFRESH EVERY 5 SECONDS
        const interval = setInterval(() => {
            fetchData();
            fetchDebug();
        }, 5000);

        // Cleanup when component unmounts
        return () => clearInterval(interval);
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert severity="error" sx={{ borderRadius: '1rem', mb: 3 }}>{error}</Alert>;

    const { students, volunteers, ngos, donors } = summary;

    return (
        <Box className="fade-in">
            <Box mb={5}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#111827', mb: 1, letterSpacing: '-0.03em' }}>
                    Dashboard <Box component="span" sx={{ color: '#4f46e5' }}>Overview (v2.0)</Box>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Welcome back! Here's what's happening with HelpBridge today.
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Welcome back! Here's what's happening with HelpBridge today.
                </Typography>

                {/* TEMP DEBUG DUMP */}
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f3f4f6', borderRadius: 2, fontSize: '0.75rem', fontFamily: 'monospace', overflow: 'auto' }}>
                    <strong>DEBUG RAW DATA:</strong>
                    <pre>{JSON.stringify(summary, null, 2)}</pre>
                </Box>


            </Box>

            {/* Empty State Check */}
            {((students?.total || 0) + (volunteers?.total || 0) + (ngos?.total || 0) + (donors?.total || 0) === 0) && (
                <Alert severity="warning" sx={{ mb: 4, borderRadius: '1rem', alignItems: 'center' }}>
                    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                        <Typography variant="body1">
                            The database appears to be empty. Do you want to load demo data?
                        </Typography>
                        <Box component="button"
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    const user = JSON.parse(localStorage.getItem('user'));
                                    await fetch('/api/admin/seed', {
                                        method: 'POST',
                                        headers: { 'Authorization': `Bearer ${user?.token}` }
                                    });
                                    window.location.reload();
                                } catch (e) {
                                    setError("Seeding failed: " + e.message);
                                    setLoading(false);
                                }
                            }}
                            sx={{
                                px: 3, py: 1,
                                bgcolor: '#4f46e5', color: 'white',
                                borderRadius: '0.5rem', border: 'none',
                                fontWeight: 'bold', cursor: 'pointer',
                                '&:hover': { bgcolor: '#4338ca' }
                            }}
                        >
                            Initialize Demo Data
                        </Box>
                    </Box>
                </Alert>
            )}

            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard title="Students" count={students} route="/admin/students" icon={<School fontSize="large" />} color="#4f46e5" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard title="Volunteers" count={volunteers} route="/admin/volunteers" icon={<VolunteerActivism fontSize="large" />} color="#10b981" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard title="NGOs" count={ngos} route="/admin/ngos" icon={<Business fontSize="large" />} color="#f59e0b" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard title="Donors" count={donors} route="/admin/donors" icon={<Favorite fontSize="large" />} color="#ef4444" />
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: '1.5rem',
                            border: '1px solid rgba(0,0,0,0.05)',
                            background: '#ffffff'
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                            <Avatar sx={{ bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                                <History />
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>
                                Recent Activity
                            </Typography>
                        </Box>
                        <List sx={{ p: 0 }}>
                            {activities.map((activity, index) => (
                                <React.Fragment key={activity.id}>
                                    <ListItem alignItems="flex-start" sx={{ px: 0, py: 2.5 }}>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>
                                                        {activity.title}
                                                    </Typography>
                                                    <Chip
                                                        label={activity.type}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            borderRadius: '0.5rem',
                                                            bgcolor: activity.type === 'Service' ? 'rgba(79, 70, 229, 0.1)' : activity.type === 'Donation' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)',
                                                            color: activity.type === 'Service' ? '#4f46e5' : activity.type === 'Donation' ? '#10b981' : '#6b7280',
                                                            border: 'none'
                                                        }}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box display="flex" justifyContent="space-between" mt={1}>
                                                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                                                        User: <Box component="span" sx={{ color: '#111827', fontWeight: 600 }}>{activity.user}</Box>
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500 }}>
                                                        {new Date(activity.date).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < activities.length - 1 && <Divider sx={{ opacity: 0.5 }} />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box display="flex" flexDirection="column" gap={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: '1.5rem',
                                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                                color: 'white',
                                boxShadow: '0 20px 25px -5px rgba(79, 70, 229, 0.2)'
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                                <FlashOn />
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    Quick Actions
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', transform: 'translateX(5px)' }
                                    }}
                                >
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Review Pending Students</Typography>
                                </Paper>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', transform: 'translateX(5px)' }
                                    }}
                                >
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>View Urgent Requests</Typography>
                                </Paper>
                            </Box>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: '1.5rem',
                                border: '1px solid rgba(0,0,0,0.05)',
                                background: '#ffffff'
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                                <TrendingUp sx={{ color: '#10b981' }} />
                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>
                                    Impact Stats
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" gap={3}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>Total Impact</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827' }}>1,240+</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>Active Volunteers</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827' }}>450+</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Box >
    );
};

export default AdminDashboard;
