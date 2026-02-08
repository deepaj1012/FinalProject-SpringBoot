import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Tab, Nav, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import { FaHandHoldingHeart, FaUsers, FaRupeeSign, FaChartLine, FaCheckCircle, FaExclamationCircle, FaBoxOpen, FaTrash } from 'react-icons/fa';
import { getDashboardStats, getHelpRequests, acceptRequest, assignVolunteer, allocateFunds, markRequestCompleted, getVolunteers, getMyDonationNeeds, postDonationNeed, deleteHelpRequest } from '../../services/ngoService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NGODashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Data States
    const [helpRequests, setHelpRequests] = useState([]); // For table
    const [requestFilter, setRequestFilter] = useState('pending'); // pending, ongoing, completed
    const [volunteers, setVolunteers] = useState([]);
    const [donationNeeds, setDonationNeeds] = useState([]);

    // Modal States
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedVolunteer, setSelectedVolunteer] = useState('');

    const [showFundModal, setShowFundModal] = useState(false);
    const [fundAmount, setFundAmount] = useState(0);

    const [showPostNeedModal, setShowPostNeedModal] = useState(false);
    const [needForm, setNeedForm] = useState({ title: '', description: '', targetAmount: 0 });

    const [error, setError] = useState(null);

    // Fetch Stats & Initial Data
    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await getHelpRequests(requestFilter);
            setHelpRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchVolunteers = async (city) => {
        try {
            const data = await getVolunteers(city);
            setVolunteers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDonationNeeds = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.userId) {
                const data = await getMyDonationNeeds(user.userId);
                setDonationNeeds(data);
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        const loadInitial = async () => {
            await fetchStats();
            setLoading(false);
        };
        loadInitial();
    }, []);

    useEffect(() => {
        if (activeTab === 'requests') fetchRequests();
        if (activeTab === 'volunteers') fetchVolunteers();
        if (activeTab === 'campaigns') fetchDonationNeeds();
    }, [activeTab, requestFilter]);

    // Actions
    const handleAcceptRequest = async (id) => {
        if (!window.confirm("Accept this request and take responsibility?")) return;
        try {
            await acceptRequest(id);
            alert("Request Accepted!");
            fetchStats();
            fetchRequests();
        } catch (err) { alert(err.message); }
    };

    const handleAssignVolunteer = async () => {
        if (!selectedVolunteer) return alert("Select a volunteer");
        try {
            await assignVolunteer(selectedRequest.id, selectedVolunteer);
            alert("Volunteer Assigned!");
            setShowAssignModal(false);
            fetchStats();
            fetchRequests();
        } catch (err) { alert(err.message); }
    };

    const handleAllocateFunds = async () => {
        if (fundAmount <= 0) return alert("Enter valid amount");
        try {
            await allocateFunds(selectedRequest.id, fundAmount);
            alert("Funds Allocated!");
            setShowFundModal(false);
            fetchStats();
            fetchRequests();
        } catch (err) { alert(err.message); }
    };

    const handleMarkCompleted = async (id) => {
        if (!window.confirm("Mark this request as completed?")) return;
        try {
            await markRequestCompleted(id);
            alert("Request Completed!");
            fetchStats();
            fetchRequests();
        } catch (err) { alert(err.message); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this request? This action cannot be undone.")) return;
        try {
            await deleteHelpRequest(id);
            alert("Request Deleted!");
            fetchStats();
            fetchRequests();
        } catch (err) { alert(err.message); }
    };

    const handlePostNeed = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await postDonationNeed(needForm, user.userId);
            alert("Campaign Created!");
            setShowPostNeedModal(false);
            setNeedForm({ title: '', description: '', targetAmount: 0 });
            fetchDonationNeeds();
        } catch (err) { alert(err.message); }
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            PENDING: 'warning',
            ASSIGNED: 'info',
            ACCEPTED: 'primary',
            IN_PROGRESS: 'success',
            COMPLETED: 'success',
            Pending: 'warning', Accepted: 'info', InProgress: 'primary', Completed: 'success' // Fallbacks
        };
        return <Badge bg={colors[status] || 'secondary'}>{status}</Badge>;
    };

    if (loading && !stats) return <LoadingSpinner />;

    return (
        <div className="bg-light min-vh-100 font-sans">
            <Container fluid className="py-4">
                <Row>
                    {/* Sidebar / Navigation */}
                    <Col md={2} className="d-none d-md-block bg-white shadow-sm min-vh-90 rounded-3 me-3 p-3">
                        <h4 className="fw-bold text-primary mb-4 px-2">NGO Panel</h4>
                        <Nav variant="pills" className="flex-column gap-2" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                            <Nav.Item>
                                <Nav.Link eventKey="overview" className="d-flex align-items-center gap-2">
                                    <FaChartLine /> Overview
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="requests" className="d-flex align-items-center gap-2">
                                    <FaHandHoldingHeart /> Help Requests
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="volunteers" className="d-flex align-items-center gap-2">
                                    <FaUsers /> Volunteers
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="campaigns" className="d-flex align-items-center gap-2">
                                    <FaRupeeSign /> Campaigns
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="reports" className="d-flex align-items-center gap-2">
                                    <FaBoxOpen /> Reports
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>

                    {/* Main Content */}
                    <Col>
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2 className="fw-bold mb-0">Dashboard</h2>
                                <p className="text-muted">Welcome back, Admin</p>
                            </div>
                            <Button variant="primary" onClick={() => setShowPostNeedModal(true)}>+ New Campaign</Button>
                        </div>

                        {/* Overview Tab */}
                        {activeTab === 'overview' && stats && (
                            <Row className="g-3 mb-4">
                                <Col md={3}>
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body>
                                            <h6 className="text-muted text-uppercase small fw-bold">Pending Requests</h6>
                                            <h2 className="fw-bold text-warning">{stats.pendingRequests}</h2>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body>
                                            <h6 className="text-muted text-uppercase small fw-bold">Ongoing</h6>
                                            <h2 className="fw-bold text-primary">{stats.ongoingRequests}</h2>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body>
                                            <h6 className="text-muted text-uppercase small fw-bold">Completed</h6>
                                            <h2 className="fw-bold text-success">{stats.completedRequests}</h2>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body>
                                            <h6 className="text-muted text-uppercase small fw-bold">Active Volunteers</h6>
                                            <h2 className="fw-bold text-info">{stats.activeVolunteers}</h2>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-0 shadow-sm h-100 bg-primary text-white">
                                        <Card.Body>
                                            <h6 className="text-white-50 text-uppercase small fw-bold">Total Funds Raised</h6>
                                            <h2 className="fw-bold">₹{stats.totalFundsRaised}</h2>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-0 shadow-sm h-100 bg-dark text-white">
                                        <Card.Body>
                                            <h6 className="text-white-50 text-uppercase small fw-bold">Funds Utilized</h6>
                                            <h2 className="fw-bold">₹{stats.fundsAllocated}</h2>
                                            <small className="text-white-50">Balance: ₹{stats.balanceFunds}</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}

                        {/* Help Requests Tab */}
                        {activeTab === 'requests' && (
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-white py-3">
                                    <Nav variant="tabs" defaultActiveKey="pending" onSelect={(k) => setRequestFilter(k)}>
                                        <Nav.Item><Nav.Link eventKey="pending">Pending Requests</Nav.Link></Nav.Item>
                                        <Nav.Item><Nav.Link eventKey="ongoing">In Progress</Nav.Link></Nav.Item>
                                        <Nav.Item><Nav.Link eventKey="completed">Completed</Nav.Link></Nav.Item>
                                    </Nav>
                                </Card.Header>
                                <Card.Body>
                                    {loading ? <LoadingSpinner /> : (
                                        <Table hover responsive className="align-middle">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Beneficiary</th>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                    <th>Funds Alloc.</th>
                                                    <th>Volunteer</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {helpRequests.length === 0 ? <tr><td colSpan="7" className="text-center py-4">No requests found</td></tr> :
                                                    helpRequests.map(req => (
                                                        <tr key={req.id}>
                                                            <td className="fw-bold">{req.title}</td>
                                                            <td>{req.student?.fullName || 'Unknown'}</td>
                                                            <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                                            <td><StatusBadge status={req.status} /></td>
                                                            <td>₹{req.fundsAllocated}</td>
                                                            <td>{req.volunteer?.fullName || <span className="text-muted italic">Unassigned</span>}</td>
                                                            <td>
                                                                {requestFilter === 'pending' && (
                                                                    <Button size="sm" variant="outline-primary" onClick={() => handleAcceptRequest(req.id)}>Accept</Button>
                                                                )}
                                                                {requestFilter === 'ongoing' && (
                                                                    <div className="d-flex gap-2">
                                                                        {!req.volunteer && <Button size="sm" variant="outline-info" onClick={() => {
                                                                            setSelectedRequest(req);
                                                                            // Prioritize Request specific city, else Student city
                                                                            const city = req.city || req.student?.city;
                                                                            fetchVolunteers(city);
                                                                            setShowAssignModal(true);
                                                                        }}>Assign Vol.</Button>}
                                                                        <Button size="sm" variant="outline-success" onClick={() => { setSelectedRequest(req); setShowFundModal(true); }}>Fund</Button>
                                                                        <Button size="sm" variant="success" onClick={() => handleMarkCompleted(req.id)}><FaCheckCircle /></Button>
                                                                        <Button size="sm" variant="danger" title="Delete Request" onClick={() => handleDelete(req.id)}><FaTrash /></Button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </Card.Body>
                            </Card>
                        )}

                        {/* Volunteers Tab */}
                        {activeTab === 'volunteers' && (
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <h5>Available Volunteers</h5>
                                    <Table hover>
                                        <thead><tr><th>Name</th><th>Phone</th><th>Status</th></tr></thead>
                                        <tbody>
                                            {volunteers.map(vol => (
                                                <tr key={vol.id}>
                                                    <td>{vol.fullName}</td>
                                                    <td>{vol.phoneNumber}</td>
                                                    <td><Badge bg="success">Available</Badge></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        )}

                        {/* Campaigns Tab */}
                        {activeTab === 'campaigns' && (
                            <Row className="g-4">
                                {donationNeeds.map(need => (
                                    <Col md={6} key={need.donationRequestId}>
                                        <Card className="border-0 shadow-sm h-100">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <h5 className="fw-bold">{need.title}</h5>
                                                    <Badge bg={need.status === 'Pending' ? 'warning' : 'success'}>{need.status}</Badge>
                                                </div>
                                                <p className="small text-muted">{need.description}</p>
                                                <ProgressBar now={(need.collectedAmount / need.targetAmount) * 100} variant="success" className="mb-2" style={{ height: '8px' }} />
                                                <div className="d-flex justify-content-between small fw-bold">
                                                    <span>₹{need.collectedAmount} Raised</span>
                                                    <span className="text-muted">Target: ₹{need.targetAmount}</span>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}

                        {/* Reports Tab */}
                        {activeTab === 'reports' && (
                            <div className="text-center py-5">
                                <FaChartLine size={50} className="text-muted mb-3 opacity-50" />
                                <h4>Reports Module</h4>
                                <p className="text-muted">Monthly impact reports will be available here.</p>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>

            {/* Modals */}
            <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
                <Modal.Header closeButton><Modal.Title>Assign Volunteer</Modal.Title></Modal.Header>
                <Modal.Body>
                    {selectedRequest && <p className="text-muted small mb-2">
                        Looking for <strong>Nearest Volunteers</strong> in: <strong>{selectedRequest.city || selectedRequest.student?.city || 'All Cities'}</strong>
                    </p>}

                    <Form.Select value={selectedVolunteer} onChange={(e) => setSelectedVolunteer(e.target.value)} className="mb-3">
                        <option value="">Select Volunteer...</option>
                        {volunteers.map(v => <option key={v.id} value={v.id}>{v.fullName} ({v.city || 'Unknown City'})</option>)}
                    </Form.Select>

                    {volunteers.length === 0 && (
                        <Alert variant="warning" className="py-2 small">
                            No volunteers found in this area.
                        </Alert>
                    )}

                    <div className="d-flex justify-content-end">
                        <Button variant="outline-secondary" size="sm" onClick={() => fetchVolunteers()}>
                            Show All Volunteers
                        </Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleAssignVolunteer} disabled={!selectedVolunteer}>Assign</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showFundModal} onHide={() => setShowFundModal(false)}>
                <Modal.Header closeButton><Modal.Title>Allocate Funds</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Label>Amount (₹)</Form.Label>
                    <Form.Control type="number" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleAllocateFunds}>Allocate</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPostNeedModal} onHide={() => setShowPostNeedModal(false)}>
                <Modal.Header closeButton><Modal.Title>Create New Campaign</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control value={needForm.title} onChange={e => setNeedForm({ ...needForm, title: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" value={needForm.description} onChange={e => setNeedForm({ ...needForm, description: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Target Amount</Form.Label>
                        <Form.Control type="number" value={needForm.targetAmount} onChange={e => setNeedForm({ ...needForm, targetAmount: e.target.value })} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePostNeed}>Create Campaign</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default NGODashboard;
