import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            const response = await fetch('/api/contact/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message. Please try again later.');
            }

            setStatus({ loading: false, success: true, error: null });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus({ loading: false, success: false, error: err.message });
        }
    };

    return (
        <div className="contact-page" style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Header */}
            <div className="bg-primary text-white py-5 mb-5 shadow-sm">
                <Container className="text-center">
                    <h1 className="fw-bold display-5">Get in Touch</h1>
                    <p className="lead opacity-75">We'd love to hear from you. Here's how you can reach us.</p>
                </Container>
            </div>

            <Container>
                <Row className="g-5">
                    {/* Contact Info */}
                    <Col lg={5}>
                        <div className="pe-lg-4">
                            <h2 className="fw-bold mb-4 text-dark">Contact Information</h2>
                            <p className="text-muted mb-4">
                                Have questions about donations, volunteering, or just want to say hello?
                                Reach out to us using the contact details below.
                            </p>

                            <Card className="border-0 shadow-sm mb-3">
                                <Card.Body className="d-flex align-items-center gap-3">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                                        <FaMapMarkerAlt size={24} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Our Location</h6>
                                        <p className="mb-0 text-muted small">123 HelpBridge Lane, Social City, India</p>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm mb-3">
                                <Card.Body className="d-flex align-items-center gap-3">
                                    <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                                        <FaPhone size={24} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Phone Number</h6>
                                        <p className="mb-0 text-muted small">+91 98765 43210</p>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm mb-3">
                                <Card.Body className="d-flex align-items-center gap-3">
                                    <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                                        <FaEnvelope size={24} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Email Address</h6>
                                        <p className="mb-0 text-muted small">connect@helpbridge.org</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                    {/* Contact Form */}
                    <Col lg={7}>
                        <Card className="border-0 shadow-lg p-4">
                            <Card.Body>
                                <h3 className="fw-bold mb-4">Send us a Message</h3>
                                
                                {status.success && (
                                    <Alert variant="success" className="d-flex align-items-center gap-2 mb-4">
                                        <FaCheckCircle /> Your message has been sent successfully! We'll get back to you soon.
                                    </Alert>
                                )}

                                {status.error && (
                                    <Alert variant="danger" className="mb-4">
                                        {status.error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <Form.Group controlId="name">
                                                <Form.Label className="small fw-bold text-uppercase text-muted">Your Name</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    placeholder="Rohan Parab" 
                                                    size="lg" 
                                                    required 
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Group controlId="email">
                                                <Form.Label className="small fw-bold text-uppercase text-muted">Email Address</Form.Label>
                                                <Form.Control 
                                                    type="email" 
                                                    placeholder="name@example.com" 
                                                    size="lg" 
                                                    required 
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3" controlId="subject">
                                        <Form.Label className="small fw-bold text-uppercase text-muted">Subject</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="How can we help?" 
                                            size="lg" 
                                            required 
                                            value={formData.subject}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="message">
                                        <Form.Label className="small fw-bold text-uppercase text-muted">Message</Form.Label>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={5} 
                                            placeholder="Write your message here..." 
                                            required 
                                            value={formData.message}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        size="lg" 
                                        className="w-100 d-flex align-items-center justify-content-center gap-2"
                                        disabled={status.loading}
                                    >
                                        {status.loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" /> Sending...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane /> Send Message
                                            </>
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ContactUs;
