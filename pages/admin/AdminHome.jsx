import React, { useEffect, useState } from 'react';
import { Grid, Box, Alert, Typography, Paper, List, ListItem, ListItemText, Divider, Chip, Avatar } from '@mui/material';
import { History, FlashOn, TrendingUp, Assessment, School, VolunteerActivism, Business, Favorite } from '@mui/icons-material';
import SummaryCard from '../../components/admin/SummaryCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getDashboardSummary, getRecentActivities } from '../../services/adminService';

const AdminHome = () => {
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
            <Box mb={5} textAlign="center">
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#111827', mb: 1, letterSpacing: '-0.03em' }}>
                    Dashboard <Box component="span" sx={{ color: '#4f46e5' }}>Overview</Box>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Welcome back! Here's what's happening with HelpBridge today.
                </Typography>


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

            <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <SummaryCard title="Students" count={students} route="/admin/students" icon={<School fontSize="large" />} color="#4f46e5" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <SummaryCard title="Volunteers" count={volunteers} route="/admin/volunteers" icon={<VolunteerActivism fontSize="large" />} color="#10b981" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <SummaryCard title="NGOs" count={ngos} route="/admin/ngos" icon={<Business fontSize="large" />} color="#f59e0b" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <SummaryCard title="Donors" count={donors} route="/admin/donors" icon={<Favorite fontSize="large" />} color="#ef4444" />
                </Grid>
            </Grid>



        </Box >
    );
};

export default AdminHome;
