// src/pages/admin/VolunteerList.jsx
import React, { useEffect, useState } from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Button, Alert, Typography, Paper, Chip, Avatar, IconButton, Tooltip } from '@mui/material';
import { Block, CheckCircle, Visibility, MoreVert, Star, Close, Description, Cancel, Delete } from '@mui/icons-material';
import { Modal, Fade, Backdrop, Divider, Grid } from '@mui/material';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getVolunteers, suspendUser, approveUser, deleteUser } from '../../services/adminService';

const VolunteerList = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchVolunteers = async () => {
        try {
            const data = await getVolunteers();
            setVolunteers(data);
        } catch (err) {
            setError(err.message || 'Failed to load volunteers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const handleSuspend = async (id) => {
        try {
            await suspendUser(id);
            fetchVolunteers();
            if (selectedVolunteer && selectedVolunteer.id === id) {
                setModalOpen(false);
            }
        } catch (err) {
            window.alert('Failed to suspend: ' + err.message);
        }
    };

    const handleActivate = async (id) => {
        try {
            await approveUser(id);
            window.alert('🎊 Success! The Volunteer has been activated.');
            fetchVolunteers();
            if (selectedVolunteer && selectedVolunteer.id === id) {
                setModalOpen(false);
            }
        } catch (err) {
            window.alert('Failed to activate: ' + err.message);
        }
    };

    const handleViewDetails = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this volunteer?')) return;
        try {
            await deleteUser(id);
            fetchVolunteers();
            if (selectedVolunteer && selectedVolunteer.id === id) {
                setModalOpen(false);
            }
        } catch (err) {
            window.alert('Failed to delete: ' + err.message);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert severity="error" sx={{ borderRadius: '1rem', mb: 3 }}>{error}</Alert>;

    return (
        <Box className="fade-in">
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 0.5, letterSpacing: '-0.02em' }}>
                        Volunteer <Box component="span" sx={{ color: '#4f46e5' }}>Network</Box>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Manage your volunteer base and monitor their engagement levels.
                    </Typography>
                </Box>
                <Button variant="contained" sx={{ bgcolor: '#4f46e5', borderRadius: '0.75rem', px: 3, py: 1, fontWeight: 700 }}>
                    Add Volunteer
                </Button>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    background: '#ffffff'
                }}
            >
                <Table>
                    <TableHead sx={{ bgcolor: '#f9fafb' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: '#4b5563', py: 2.5 }}>Volunteer</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#4b5563' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#4b5563' }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#4b5563' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {volunteers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                    <Typography color="textSecondary">No volunteers found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            volunteers.map((v) => (
                                <TableRow key={v.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 700 }}>
                                                {v.fullName.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>{v.fullName}</Typography>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <Star sx={{ fontSize: 14, color: '#f59e0b' }} />
                                                    <Typography variant="caption" color="textSecondary">Top Rated</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500 }}>{v.email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={v.status}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                borderRadius: '0.5rem',
                                                bgcolor: v.status === 'Active' || v.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: v.status === 'Active' || v.status === 'Approved' ? '#10b981' : '#ef4444',
                                                border: 'none'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box display="flex" justifyContent="flex-end" gap={1}>
                                            {v.status === 'Active' || v.status === 'Approved' ? (
                                                <Tooltip title="Suspend">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleSuspend(v.id)}
                                                        sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.05)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                                                    >
                                                        <Block fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Activate">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleActivate(v.id)}
                                                        sx={{ color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.05)', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' } }}
                                                    >
                                                        <CheckCircle fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="View Profile">
                                                <IconButton
                                                    size="small"
                                                    sx={{ color: '#6b7280' }}
                                                    onClick={() => handleViewDetails(v)}
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(v.id)}
                                                    sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500, sx: { backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)' } }}
            >
                <Fade in={modalOpen}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', md: 600 },
                        bgcolor: 'background.paper',
                        borderRadius: '1.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        p: 0,
                        overflow: 'hidden'
                    }}>
                        {/* Modal Header */}
                        <Box sx={{ p: 3, bgcolor: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>
                                Volunteer Profile
                            </Typography>
                            <IconButton onClick={() => setModalOpen(false)} size="small">
                                <Close />
                            </IconButton>
                        </Box>

                        {/* Modal Content */}
                        <Box sx={{ p: 4 }}>
                            {selectedVolunteer && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} display="flex" alignItems="center" gap={3} mb={2}>
                                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '2rem', fontWeight: 800 }}>
                                            {selectedVolunteer.fullName.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>{selectedVolunteer.fullName}</Typography>
                                            <Typography variant="body1" color="textSecondary">{selectedVolunteer.email}</Typography>
                                            <Chip
                                                label={selectedVolunteer.status}
                                                size="small"
                                                sx={{
                                                    mt: 1,
                                                    fontWeight: 700,
                                                    bgcolor: selectedVolunteer.status === 'Approved' || selectedVolunteer.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: selectedVolunteer.status === 'Approved' || selectedVolunteer.status === 'Active' ? '#10b981' : '#ef4444',
                                                }}
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{ mb: 3 }} />
                                        <Typography variant="subtitle2" sx={{ color: '#6b7280', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Identity Verification
                                        </Typography>
                                        <Box sx={{
                                            p: 3,
                                            borderRadius: '1rem',
                                            bgcolor: '#f3f4f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            border: '2px dashed #d1d5db'
                                        }}>
                                            <Description sx={{ color: '#10b981', fontSize: 40 }} />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>
                                                    ID Proof Document
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Path: {selectedVolunteer.idProofPath || 'No document uploaded'}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ borderRadius: '0.5rem', fontWeight: 700, color: '#10b981', borderColor: '#10b981' }}
                                                onClick={() => {
                                                    if (selectedVolunteer.idProofPath) {
                                                        window.open(selectedVolunteer.idProofPath, '_blank');
                                                    } else {
                                                        window.alert('No document available');
                                                    }
                                                }}
                                            >
                                                View
                                            </Button>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                            {selectedVolunteer.status === 'Pending' || selectedVolunteer.status === 'Suspended' ? (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={<CheckCircle />}
                                                    onClick={() => handleActivate(selectedVolunteer.id)}
                                                    sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, borderRadius: '0.75rem', py: 1.5, fontWeight: 700 }}
                                                >
                                                    Activate Volunteer
                                                </Button>
                                            ) : (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={<Block />}
                                                    onClick={() => handleSuspend(selectedVolunteer.id)}
                                                    sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, borderRadius: '0.75rem', py: 1.5, fontWeight: 700 }}
                                                >
                                                    Suspend
                                                </Button>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            )}
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default VolunteerList;
