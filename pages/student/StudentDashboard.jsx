import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, ListGroup, Badge, Alert, Row, Col } from 'react-bootstrap';
import { FaPlus, FaHistory, FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { getMyRequests, createRequest } from '../../services/studentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestType, setRequestType] = useState('Writer');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        scheduledAt: '',
        location: '',
        city: '',
        requiredAmount: ''
    });

    const fetchRequests = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.userId) {
                const data = await getMyRequests(user.userId);
                setRequests(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.location) {
            alert("Please use the 'Use Current Location' button to capture your location.");
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const dateObj = new Date(formData.scheduledAt);
            const requestDate = dateObj.toISOString().split('T')[0];
            const requestTime = dateObj.toTimeString().split(' ')[0];

            await createRequest({
                description: `${requestType} Support: ${formData.title}. ${formData.description}`,
                city: formData.city,
                location: formData.location,
                requestDate: requestDate,
                requestTime: requestTime,
                student: { id: user.userId }
            });
            alert('Request Submitted Successfully!');
            setFormData({ title: '', description: '', scheduledAt: '', location: '', city: '', requiredAmount: '' });
            fetchRequests();
        } catch (err) {
            alert('Failed to submit request: ' + err.message);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="fade-in py-5" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)', minHeight: '90vh' }}>
            <Container>
                <div className="mb-5">
                    <h1 className="display-4 fw-bold mb-2">Student <span className="text-gradient">Dashboard</span></h1>
                    <p className="text-muted fs-5">Manage your assistance requests and track their status.</p>
                </div>

                {error && <Alert variant="danger" className="rounded-xl shadow-sm">{error}</Alert>}

                <Row className="g-4">
                    {/* Request Form */}
                    <Col lg={5}>
                        <Card className="glass-card h-100 p-3">
                            <Card.Body>
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <div className="bg-soft-primary p-2 rounded-circle">
                                        <FaPlus className="text-primary" />
                                    </div>
                                    <h3 className="fw-bold mb-0">New Request</h3>
                                </div>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Assistance Type</Form.Label>
                                        <Form.Select
                                            value={requestType}
                                            onChange={(e) => setRequestType(e.target.value)}
                                            className="py-3 shadow-none border-0 bg-gray-100"
                                        >
                                            <option value="Writer">Writer for Exam</option>
                                            <option value="Travel">Travel Support</option>
                                            <option value="Medical">Medical Aid</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Title / Subject</Form.Label>
                                        <Form.Control
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g. Mathematics Exam"
                                            className="py-3 shadow-none border-0 bg-gray-100"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe your need in detail..."
                                            className="py-3 shadow-none border-0 bg-gray-100"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Required Amount (₹)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.requiredAmount}
                                            onChange={(e) => setFormData({ ...formData, requiredAmount: e.target.value })}
                                            placeholder="Enter amount if financial help is needed (Optional)"
                                            className="py-3 shadow-none border-0 bg-gray-100"
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-semibold">Date & Time</Form.Label>
                                                <Form.Control
                                                    type="datetime-local"
                                                    required
                                                    value={formData.scheduledAt}
                                                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                                    className="py-3 shadow-none border-0 bg-gray-100"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-semibold">City</Form.Label>
                                                <Form.Control
                                                    required
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                    placeholder="City (e.g. Pune)"
                                                    className="py-3 shadow-none border-0 bg-gray-100"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-semibold">Location</Form.Label>
                                                <div className="d-grid">
                                                    <Button
                                                        variant={formData.location ? "success" : "outline-primary"}
                                                        className="py-3 d-flex align-items-center justify-content-center gap-2"
                                                        onClick={() => {
                                                            if (navigator.geolocation) {
                                                                navigator.geolocation.getCurrentPosition(async (pos) => {
                                                                    const { latitude, longitude } = pos.coords;
                                                                    setFormData({
                                                                        ...formData,
                                                                        location: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`,
                                                                    });
                                                                }, () => alert('Permission denied. Please enable location.'));
                                                            } else {
                                                                alert('Geolocation not supported');
                                                            }
                                                        }}
                                                    >
                                                        {formData.location ? <><FaCheckCircle /> Location Captured</> : "📍 Use Current Location"}
                                                    </Button>
                                                </div>
                                                {formData.location && <div className="mt-2 text-muted small">{formData.location}</div>}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Button variant="primary" type="submit" className="w-100 py-3 mt-3 shadow-lg fw-bold">
                                        Submit Request
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Request List */}
                    <Col lg={7}>
                        <Card className="glass-card h-100 p-3">
                            <Card.Body>
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <div className="bg-soft-success p-2 rounded-circle">
                                        <FaHistory className="text-success" />
                                    </div>
                                    <h3 className="fw-bold mb-0">My Requests</h3>
                                </div>

                                <div className="requests-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    {requests.length === 0 ? (
                                        <div className="text-center py-5">
                                            <FaInfoCircle size={40} className="text-muted mb-3 opacity-50" />
                                            <p className="text-muted">No requests found. Create one to get started!</p>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-3">
                                            {requests.map(req => (
                                                <div key={req.id} className="p-3 rounded-xl border bg-white shadow-sm transition-all hover-translate-y">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h5 className="fw-bold mb-0">{req.title}</h5>
                                                        <Badge
                                                            pill
                                                            bg={req.status === 'Accepted' ? 'success' : req.status === 'Pending' ? 'warning' : 'secondary'}
                                                            className="px-3 py-2"
                                                        >
                                                            {req.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-muted small mb-3">{req.description}</p>
                                                    <div className="d-flex flex-wrap gap-3">
                                                        <div className="d-flex align-items-center gap-1 text-muted small">
                                                            <FaCalendarAlt className="text-primary" />
                                                            {new Date(req.scheduledAt).toLocaleString()}
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1 text-muted small">
                                                            <FaMapMarkerAlt className="text-danger" />
                                                            {req.location}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default StudentDashboard;
