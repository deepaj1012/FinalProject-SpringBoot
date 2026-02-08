// src/pages/admin/StudentList.jsx
import React, { useEffect, useState } from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Button, Alert, Typography, Paper, Chip, Avatar, IconButton, Tooltip } from '@mui/material';
import { CheckCircle, Cancel, Visibility, MoreVert, Close, Description, Delete } from '@mui/icons-material';
import { Modal, Fade, Backdrop, Divider, Grid } from '@mui/material';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getStudents, approveUser, rejectUser, deleteUser } from '../../services/adminService';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchStudents = async () => {
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (err) {
            setError(err.message || 'Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser(id);
            fetchStudents();
            if (selectedStudent && selectedStudent.id === id) {
                setModalOpen(false);
            }
        } catch (err) {
            window.alert('Failed to delete user: ' + err.message);
        }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'approve') {
                await approveUser(id);
                window.alert('🎊 Success! The user has been approved and notified.');
            } else if (action === 'reject') {
                await rejectUser(id);
                window.alert('User registration has been rejected.');
            }
            fetchStudents();
            if (selectedStudent && selectedStudent.id === id) {
                setModalOpen(false);
            }
        } catch (err) {
            window.alert(`Failed to ${action} user: ${err.message}`);
        }
    };

    const handleViewDetails = (student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <Alert severity="error" sx={{ borderRadius: '1rem', mb: 3 }}>{error}</Alert>;

    return (
        <Box className="fade-in">
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 0.5, letterSpacing: '-0.02em' }}>
                        Student <Box component="span" sx={{ color: '#4f46e5' }}>Management</Box>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Review and manage student registrations and verification status.
                    </Typography>
                </Box>
                <Button variant="contained" sx={{ bgcolor: '#4f46e5', borderRadius: '0.75rem', px: 3, py: 1, fontWeight: 700 }}>
                    Export Data
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
                            <TableCell sx={{ fontWeight: 700, color: '#4b5563', py: 2.5 }}>Student</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#4b5563' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#4b5563' }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#4b5563' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                    <Typography color="textSecondary">No students found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((s) => (
                                <TableRow key={s.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Avatar sx={{ bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', fontWeight: 700 }}>
                                                {s.fullName.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>{s.fullName}</Typography>
                                                <Typography variant="caption" color="textSecondary">ID: {s.id}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500 }}>{s.email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={s.status}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                borderRadius: '0.5rem',
                                                bgcolor: s.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : s.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: s.status === 'Approved' ? '#10b981' : s.status === 'Pending' ? '#f59e0b' : '#ef4444',
                                                border: 'none'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box display="flex" justifyContent="flex-end" gap={1}>
                                            {s.status === 'Pending' && (
                                                <>
                                                    <Tooltip title="Approve">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleAction(s.id, 'approve')}
                                                            sx={{ color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.05)', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' } }}
                                                        >
                                                            <CheckCircle fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Reject">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleAction(s.id, 'reject')}
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
                                                    onClick={() => handleViewDetails(s)}
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(s.id)}
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
                                Student Details
                            </Typography>
                            <IconButton onClick={() => setModalOpen(false)} size="small">
                                <Close />
                            </IconButton>
                        </Box>

                        {/* Modal Content */}
                        <Box sx={{ p: 4 }}>
                            {selectedStudent && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} display="flex" alignItems="center" gap={3} mb={2}>
                                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', fontSize: '2rem', fontWeight: 800 }}>
                                            {selectedStudent.fullName.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>{selectedStudent.fullName}</Typography>
                                            <Typography variant="body1" color="textSecondary">{selectedStudent.email}</Typography>
                                            <Chip
                                                label={selectedStudent.status}
                                                size="small"
                                                sx={{
                                                    mt: 1,
                                                    fontWeight: 700,
                                                    bgcolor: selectedStudent.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : selectedStudent.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: selectedStudent.status === 'Approved' ? '#10b981' : selectedStudent.status === 'Pending' ? '#f59e0b' : '#ef4444',
                                                }}
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{ mb: 3 }} />
                                        <Typography variant="subtitle2" sx={{ color: '#6b7280', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Verification Document
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
                                            <Description sx={{ color: '#4f46e5', fontSize: 40 }} />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>
                                                    Disability Certificate
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Path: {selectedStudent.disabilityCertificatePath || 'No document uploaded'}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ borderRadius: '0.5rem', fontWeight: 700, color: '#4f46e5', borderColor: '#4f46e5' }}
                                                onClick={() => {
                                                    if (selectedStudent.disabilityCertificatePath) {
                                                        window.open(selectedStudent.disabilityCertificatePath, '_blank');
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
                                        {selectedStudent.status === 'Pending' && (
                                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={<CheckCircle />}
                                                    onClick={() => handleAction(selectedStudent.id, 'approve')}
                                                    sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, borderRadius: '0.75rem', py: 1.5, fontWeight: 700 }}
                                                >
                                                    Approve Student
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    startIcon={<Cancel />}
                                                    onClick={() => handleAction(selectedStudent.id, 'reject')}
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

export default StudentList;
