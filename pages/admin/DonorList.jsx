// src/pages/admin/DonorList.jsx
import React, { useEffect, useState } from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Button, Alert, Typography, Paper, Chip, Avatar, IconButton, Tooltip } from '@mui/material';
import { Visibility, MoreVert, Favorite, Close, Description, CheckCircle, Cancel, Delete } from '@mui/icons-material';
import { Modal, Fade, Backdrop, Divider, Grid } from '@mui/material';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getDonors, approveUser, rejectUser, deleteUser } from '../../services/adminService';

const DonorList = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchDonors = async () => {
        try {
            const data = await getDonors();
            setDonors(data);
        } catch (err) {
            setError(err.message || 'Failed to load donors');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this donor?')) return;
        try {
            await deleteUser(id);
            fetchDonors();
            if (selectedDonor && selectedDonor.id === id) {
                setModalOpen(false);
            }
        } catch (err) {
            window.alert('Failed to delete donor: ' + err.message);
        }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'approve') {
                await approveUser(id);
                window.alert('🎊 Success! The Donor has been approved.');
            } else if (action === 'reject') {
                await rejectUser(id);
                window.alert('Donor registration has been rejected.');
            }
            fetchDonors();
            if (selectedDonor && selectedDonor.id === id) {
                setModalOpen(false);
            }
        } catch (err) {
            window.alert(`Failed to ${action} donor: ${err.message}`);
        }
    };

    const handleViewDetails = (donor) => {
        setSelectedDonor(donor);
        setModalOpen(true);
    };

    useEffect(() => {
        fetchDonors();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert severity="error" sx={{ borderRadius: '1rem', mb: 3 }}>{error}</Alert>;

    return (
        <Box className="fade-in">
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 0.5, letterSpacing: '-0.02em' }}>
                        Donor <Box component="span" sx={{ color: '#4f46e5' }}>Community</Box>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        View and manage the generous individuals supporting HelpBridge.
                    </Typography>
                </Box>
                <Button variant="contained" sx={{ bgcolor: '#4f46e5', borderRadius: '0.75rem', px: 3, py: 1, fontWeight: 700 }}>
                    Generate Report
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
                            <TableCell sx={{ fontWeight: 700, color: '#4b5563', py: 2.5 }}>Donor</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#4b5563' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#4b5563' }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#4b5563' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {donors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                    <Typography color="textSecondary">No donors found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            donors.map((d) => (
                                <TableRow key={d.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 700 }}>
                                                <Favorite fontSize="small" />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>{d.fullName}</Typography>
                                                <Typography variant="caption" color="textSecondary">Regular Donor</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500 }}>{d.email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={d.status}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                borderRadius: '0.5rem',
                                                bgcolor: d.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : d.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: d.status === 'Approved' ? '#10b981' : d.status === 'Pending' ? '#f59e0b' : '#ef4444',
                                                border: 'none'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box display="flex" justifyContent="flex-end" gap={1}>
                                            {d.status === 'Pending' && (
                                                <>
                                                    <Tooltip title="Approve">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleAction(d.id, 'approve')}
                                                            sx={{ color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.05)', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' } }}
                                                        >
                                                            <CheckCircle fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Reject">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleAction(d.id, 'reject')}
                                                            sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.05)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                                                        >
                                                            <Cancel fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    size="small"
                                                    sx={{ color: '#6b7280' }}
                                                    onClick={() => handleViewDetails(d)}
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(d.id)}
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
                                Donor Profile
                            </Typography>
                            <IconButton onClick={() => setModalOpen(false)} size="small">
                                <Close />
                            </IconButton>
                        </Box>

                        {/* Modal Content */}
                        <Box sx={{ p: 4 }}>
                            {selectedDonor && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} display="flex" alignItems="center" gap={3} mb={2}>
                                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '2rem', fontWeight: 800 }}>
                                            <Favorite fontSize="large" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>{selectedDonor.fullName}</Typography>
                                            <Typography variant="body1" color="textSecondary">{selectedDonor.email}</Typography>
                                            <Chip
                                                label={selectedDonor.status}
                                                size="small"
                                                sx={{
                                                    mt: 1,
                                                    fontWeight: 700,
                                                    bgcolor: selectedDonor.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : selectedDonor.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: selectedDonor.status === 'Approved' ? '#10b981' : selectedDonor.status === 'Pending' ? '#f59e0b' : '#ef4444',
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
                                            <Description sx={{ color: '#ef4444', fontSize: 40 }} />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>
                                                    ID Proof Document
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Path: {selectedDonor.idProofPath || 'No document uploaded'}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ borderRadius: '0.5rem', fontWeight: 700, color: '#ef4444', borderColor: '#ef4444' }}
                                                onClick={() => {
                                                    if (selectedDonor.idProofPath) {
                                                        window.open(selectedDonor.idProofPath, '_blank');
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
                                        {selectedDonor.status === 'Pending' && (
                                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={<CheckCircle />}
                                                    onClick={() => handleAction(selectedDonor.id, 'approve')}
                                                    sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, borderRadius: '0.75rem', py: 1.5, fontWeight: 700 }}
                                                >
                                                    Approve Donor
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    startIcon={<Cancel />}
                                                    onClick={() => handleAction(selectedDonor.id, 'reject')}
                                                    sx={{ color: '#ef4444', borderColor: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.05)', borderColor: '#dc2626' }, borderRadius: '0.75rem', py: 1.5, fontWeight: 700 }}
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        )}
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

export default DonorList;
