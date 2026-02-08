import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaHandsHelping, FaUserGraduate, FaBuilding, FaHeart } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="fade-in">
            {/* Hero Section */}
            <div className="hero-gradient text-white py-5 mb-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
                <Container className="position-relative" style={{ zIndex: 10 }}>
                    <Row className="align-items-center">
                        <Col lg={6} className="text-start">
                            <h1 className="display-2 fw-bold mb-4" style={{ lineHeight: '1.1' }}>
                                Building Stronger <span className="text-primary-light">Communities</span> Together.
                            </h1>
                            <p className="lead fs-4 mb-5 opacity-90">
                                HelpBridge connects those who need support with those who can provide it.
                                Join our mission to make a real difference in people's lives.
                            </p>
                            <div className="d-flex gap-3 mt-4 flex-wrap">
                                <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 shadow-lg fw-bold text-white text-decoration-none d-inline-flex align-items-center">
                                    Get Started <FaArrowRight className="ms-2" />
                                </Link>
                                <Link to="/login" state={{ role: 'donor' }} className="btn btn-success btn-lg px-5 py-3 shadow-lg fw-bold text-white text-decoration-none d-inline-flex align-items-center">
                                    Donate Now <FaHeart className="ms-2" />
                                </Link>
                            </div>
                        </Col>
                        <Col lg={6} className="d-none d-lg-block">
                            <div className="position-relative">
                                <img
                                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
                                    alt="Community"
                                    className="img-fluid rounded-xl shadow-2xl glass-card p-2"
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80' }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* How it Works Section */}
            <Container className="py-5 mb-5">
                <div className="text-center mb-5">
                    <h2 className="display-4 fw-bold mb-3">How it <span className="text-gradient">Works</span></h2>
                    <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
                        Our platform makes it easy to give and receive help through a simple, transparent process.
                    </p>
                </div>
                <Row className="g-4 text-center">
                    <Col md={4}>
                        <div className="p-4 glass-card h-100">
                            <div className="bg-soft-primary rounded-circle d-inline-flex p-4 mb-4">
                                <FaUserGraduate size={40} className="text-primary" />
                            </div>
                            <h4 className="fw-bold mb-3">Request Support</h4>
                            <p className="text-muted">Beneficiaries can post requests for writers, medical aid, or educational resources.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-4 glass-card h-100">
                            <div className="bg-soft-success rounded-circle d-inline-flex p-4 mb-4">
                                <FaHandsHelping size={40} className="text-success" />
                            </div>
                            <h4 className="fw-bold mb-3">Connect & Help</h4>
                            <p className="text-muted">Volunteers and NGOs browse requests and offer their time or resources to help.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-4 glass-card h-100">
                            <div className="bg-soft-warning rounded-circle d-inline-flex p-4 mb-4">
                                <FaHeart size={40} className="text-warning" />
                            </div>
                            <h4 className="fw-bold mb-3">Make an Impact</h4>
                            <p className="text-muted mb-4">Track the progress of your contributions and see the real-world impact you've made.</p>
                            <Link to="/login" state={{ role: 'donor' }} className="btn btn-outline-warning rounded-pill fw-bold text-decoration-none">
                                Donate Now
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Choose Your Role Section */}
            <div className="bg-gray-100 py-5">
                <Container className="py-5">
                    <div className="text-center mb-5">
                        <h2 className="display-4 fw-bold mb-3">Choose Your <span className="text-gradient">Role</span></h2>
                        <p className="text-muted fs-5">Select how you want to contribute to the HelpBridge community.</p>
                    </div>
                    <Row className="g-4">
                        <Col xs={12} sm={6} lg={3}>
                            <Card className="h-100 glass-card text-center p-3">
                                <Card.Img
                                    variant="top"
                                    src="https://cdn-icons-png.flaticon.com/512/2910/2910768.png"
                                    className="p-4 mx-auto"
                                    style={{ height: '180px', width: '180px', objectFit: 'contain' }}
                                />
                                <Card.Body>
                                    <h5 className="fw-bold mb-2">Beneficiary</h5>
                                    <p className="text-muted small mb-4">Request writers, medical aid, or other support.</p>
                                    <Button as={Link} to="/login" state={{ role: 'student' }} variant="outline-primary" className="w-100 rounded-pill">Join Now</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} lg={3}>
                            <Card className="h-100 glass-card text-center p-3">
                                <Card.Img
                                    variant="top"
                                    src="https://cdn-icons-png.flaticon.com/512/1902/1902202.png"
                                    className="p-4 mx-auto"
                                    style={{ height: '180px', width: '180px', objectFit: 'contain' }}
                                />
                                <Card.Body>
                                    <h5 className="fw-bold mb-2">Volunteer</h5>
                                    <p className="text-muted small mb-4">Help students and contribute to society.</p>
                                    <Button as={Link} to="/login" state={{ role: 'volunteer' }} variant="outline-primary" className="w-100 rounded-pill">Join Now</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} lg={3}>
                            <Card className="h-100 glass-card text-center p-3">
                                <Card.Img
                                    variant="top"
                                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                    className="p-4 mx-auto"
                                    style={{ height: '180px', width: '180px', objectFit: 'contain' }}
                                    onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                                />
                                <Card.Body>
                                    <h5 className="fw-bold mb-2">NGO</h5>
                                    <p className="text-muted small mb-4">Post requirements and connect with donors.</p>
                                    <Button as={Link} to="/login" state={{ role: 'ngo' }} variant="outline-primary" className="w-100 rounded-pill">Join Now</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} lg={3}>
                            <Card className="h-100 glass-card text-center p-3">
                                <Card.Img
                                    variant="top"
                                    src="https://cdn-icons-png.flaticon.com/512/1165/1165725.png"
                                    className="p-4 mx-auto"
                                    style={{ height: '180px', width: '180px', objectFit: 'contain' }}
                                />
                                <Card.Body>
                                    <h5 className="fw-bold mb-2">Donor</h5>
                                    <p className="text-muted small mb-4">Support NGOs and track your contributions.</p>
                                    <Button as={Link} to="/login" state={{ role: 'donor' }} variant="outline-primary" className="w-100 rounded-pill">Join Now</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Home;
