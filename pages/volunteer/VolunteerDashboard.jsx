import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Badge, Alert } from 'react-bootstrap';
import { FaHandsHelping, FaTasks, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { getNearbyRequests, acceptRequest, getMyTasks, volunteerAcceptAssignment, volunteerRejectAssignment } from '../../services/volunteerService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VolunteerDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const city = 'Pune'; // Default, ideally fetch from user profile
            const [nearbyData, myData] = await Promise.all([
                getNearbyRequests(city),
                getMyTasks(user.userId)
            ]);
            setRequests(nearbyData);
            setMyTasks(myData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccept = async (requestId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await acceptRequest(requestId, user.userId);
            alert('Request Claimed! Now please accept the assignment in your tasks.');
            fetchData();
        } catch (err) {
            alert('Failed to claim request: ' + err.message);
        }
    };

    const handleAcceptAssignment = async (requestId) => {
        try {
            await volunteerAcceptAssignment(requestId);
            alert('Assignment Accepted! Requester has been notified.');
            fetchData();
        } catch (err) {
            alert('Failed to accept assignment: ' + err.message);
        }
    };

    const handleRejectAssignment = async (requestId) => {
        if (!window.confirm("Are you sure you want to reject this task? It will be returned to the pool.")) return;
        try {
            await volunteerRejectAssignment(requestId);
            alert('Assignment Rejected.');
            fetchData();
        } catch (err) {
            alert('Failed to reject assignment: ' + err.message);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="fade-in py-5" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)', minHeight: '90vh' }}>
            <Container>
                <div className="mb-5">
                    <h1 className="display-4 fw-bold mb-2">Volunteer <span className="text-gradient">Dashboard</span></h1>
                    <p className="text-muted fs-5">Find opportunities to help and manage your active tasks.</p>
                </div>

                {error && <Alert variant="danger" className="rounded-xl shadow-sm">{error}</Alert>}

                <div className="mb-5">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="bg-soft-primary p-2 rounded-circle">
                            <FaHandsHelping className="text-primary" />
                        </div>
                        <h3 className="fw-bold mb-0">Available Requests</h3>
                    </div>
                    <Row className="g-4">
                        {requests.length === 0 ? (
                            <Col xs={12}>
                                <Card className="glass-card text-center p-5">
                                    <p className="text-muted mb-0">No nearby requests found at the moment.</p>
                                </Card>
                            </Col>
                        ) : (
                            requests.map(req => (
                                <Col xs={12} md={6} lg={4} key={req.requestId}>
                                    <Card className="glass-card h-100 p-3 transition-all hover-translate-y">
                                        <Card.Body>
                                            <h5 className="fw-bold mb-3">{req.title}</h5>
                                            <div className="d-flex flex-column gap-2 mb-4">
                                                <div className="d-flex align-items-center gap-2 text-muted small">
                                                    <FaMapMarkerAlt className="text-danger" />
                                                    {req.location}
                                                </div>
                                                <div className="d-flex align-items-center gap-2 text-muted small">
                                                    <FaCalendarAlt className="text-primary" />
                                                    {new Date(req.scheduledAt).toLocaleString()}
                                                </div>
                                            </div>
                                            <Button variant="primary" className="w-100 py-2 shadow-sm fw-bold" onClick={() => handleAccept(req.id || req.requestId)}>
                                                Claim Request
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>
                </div>

                <div>
                    {/* Assigned Tasks (Need Acceptance) */}
                    {myTasks.filter(t => t.status === 'ASSIGNED').length > 0 && (
                        <div className="mb-5">
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <div className="bg-soft-warning p-2 rounded-circle">
                                    <FaTasks className="text-warning" />
                                </div>
                                <h3 className="fw-bold mb-0">Action Required</h3>
                            </div>
                            <Row className="g-4">
                                {myTasks.filter(t => t.status === 'ASSIGNED').map(task => (
                                    <Col xs={12} md={6} lg={4} key={task.requestId}>
                                        <Card className="glass-card h-100 p-3 border-warning transition-all hover-translate-y" style={{ borderLeft: '5px solid var(--warning)' }}>
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <h5 className="fw-bold mb-0">{task.title}</h5>
                                                    <Badge pill bg="warning" className="px-3 py-2 text-dark">Assigned</Badge>
                                                </div>
                                                <p className="text-muted small mb-3">An NGO has assigned this task to you.</p>
                                                <div className="d-flex flex-column gap-2 mb-4">
                                                    <div className="d-flex align-items-center gap-2 text-muted small">
                                                        <FaMapMarkerAlt className="text-danger" />
                                                        {task.location}
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 text-muted small">
                                                        <FaCalendarAlt className="text-primary" />
                                                        {new Date(task.scheduledAt).toLocaleString()}
                                                    </div>
                                                </div>
                                                <Button variant="warning" className="w-100 py-2 fw-bold text-dark shadow-sm mb-2" onClick={() => handleAcceptAssignment(task.requestId || task.id)}>
                                                    Accept Assignment
                                                </Button>
                                                <Button variant="outline-danger" className="w-100 py-2 fw-bold shadow-sm" onClick={() => handleRejectAssignment(task.requestId || task.id)}>
                                                    Reject
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}

                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="bg-soft-success p-2 rounded-circle">
                            <FaCheckCircle className="text-success" />
                        </div>
                        <h3 className="fw-bold mb-0">My Active Tasks</h3>
                    </div>
                    {myTasks.filter(t => t.status === 'ACCEPTED').length === 0 ? (
                        <Card className="glass-card text-center p-5">
                            <p className="text-muted mb-0">You don't have any active tasks in progress.</p>
                        </Card>
                    ) : (
                        <Row className="g-4">
                            {myTasks.filter(t => t.status === 'ACCEPTED').map(task => (
                                <Col xs={12} md={6} lg={4} key={task.requestId}>
                                    <Card className="glass-card h-100 p-3 border-success transition-all hover-translate-y" style={{ borderLeft: '5px solid var(--success)' }}>
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <h5 className="fw-bold mb-0">{task.title}</h5>
                                                <Badge pill bg="success" className="px-3 py-2">Accepted</Badge>
                                            </div>
                                            <div className="d-flex flex-column gap-2 mb-4">
                                                <div className="d-flex align-items-center gap-2 text-muted small">
                                                    <FaMapMarkerAlt className="text-danger" />
                                                    {task.location}
                                                </div>
                                                <div className="d-flex align-items-center gap-2 text-muted small">
                                                    <FaCalendarAlt className="text-primary" />
                                                    {new Date(task.scheduledAt).toLocaleString()}
                                                </div>
                                            </div>
                                            <Button variant="outline-success" className="w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2">
                                                <FaCheckCircle /> Mark Completed
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default VolunteerDashboard;
