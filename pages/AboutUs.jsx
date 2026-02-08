import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaHandHoldingHeart, FaGlobe, FaLightbulb, FaUserTie, FaQuoteLeft, FaRocket, FaShieldAlt } from 'react-icons/fa';

import diptiImg from '../assets/dipti.jpeg';
import shreyaImg from '../assets/shreya.png';
import sagarImg from '../assets/sagar.jpg';
import deepaImg from '../assets/deepa.jpg';
import vaishakhImg from '../assets/vaishakh.jpg';
import volunteerHeroImg from '../assets/volunteer_hero.png';

const AboutUs = () => {
    const teamMembers = [
        { id: 1, name: 'Dipti Sampat Akhade', role: 'Team Member', email: 'dipti@helpbridge.com', image: diptiImg },
        { id: 2, name: 'Shreya Ajay Pandharipande', role: 'Team Member', email: 'shreya@helpbridge.com', image: shreyaImg },
        { id: 3, name: 'Sagar Satyavan Band', role: 'Team Member', email: 'sagar@helpbridge.com', image: sagarImg },
        { id: 4, name: 'Deepa Sushil Jadhav', role: 'Team Member', email: 'deepa@helpbridge.com', image: deepaImg },
        { id: 5, name: 'Vaishakh Lalchand Malode', role: 'Team Member', email: 'vaishakh@helpbridge.com', image: vaishakhImg },
    ];

    const volunteerHero = volunteerHeroImg;

    return (
        <div className="about-page fade-in" style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* 1. Hero Section */}
            <div className="hero-gradient text-white py-5 mb-5 shadow-sm border-bottom">
                <Container>
                    <Row className="align-items-center g-5">
                        <Col lg={6} className="order-lg-1">
                            <Badge bg="white" className="mb-3 px-3 py-2 rounded-pill text-primary border border-white border-opacity-25 fw-bold letter-spacing-1">
                                WHO WE ARE
                            </Badge>
                            <h1 className="display-4 fw-bold mb-4 text-white">
                                Empowering Change, <br /> <span className="text-warning">Together.</span>
                            </h1>
                            <p className="lead text-white opacity-75 mb-4" style={{ lineHeight: '1.8' }}>
                                HelpBridge is a unified ecosystem where transparency, volunteerism, and educational support converge.
                            </p>
                            <p className="text-white opacity-75 mb-4" style={{ textAlign: 'justify' }}>
                                In a world where resources often fail to reach those who need them most due to logistical barriers
                                and lack of transparency, HelpBridge serves as a beacon of hope. Our platform seamlessly connects
                                verified NGOs with donors, enables passionate volunteers to find meaningful opportunities, and
                                empowers students by linking them with educational resources.
                            </p>
                            <div className="d-flex gap-4 pt-2">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="bg-white bg-opacity-10 p-2 rounded-circle text-white">
                                        <FaRocket size={20} />
                                    </div>
                                    <span className="fw-semibold text-white">Fast Impact</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="bg-white bg-opacity-10 p-2 rounded-circle text-white">
                                        <FaShieldAlt size={20} />
                                    </div>
                                    <span className="fw-semibold text-white">Verified</span>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6} className="order-lg-2">
                            <div className="position-relative">
                                {/* Decorative elements removed for cleaner look */}
                                <img
                                    src={volunteerHero}
                                    alt="Community Impact"
                                    className="img-fluid rounded-4 shadow-lg w-100 object-fit-cover glass-card p-2"
                                    style={{ minHeight: '400px' }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* 2. Drivers of Change Grid */}
            <section className="py-5 bg-light position-relative">
                <Container className="mb-5">
                    <Row className="justify-content-center text-center mb-5">
                        <Col lg={8}>
                            <h2 className="fw-bold display-6 mb-3">Drivers of Change</h2>
                            <p className="text-muted lead">Our platform stands on three pillars that ensure resources reach the right people.</p>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        {[
                            { icon: FaHandHoldingHeart, color: 'primary', title: 'Empowerment', text: 'Connecting donors directly with verified NGOs to maximize impact.' },
                            { icon: FaGlobe, color: 'success', title: 'Community', text: 'Building a global network of volunteers ready to serve at a moment\'s notice.' },
                            { icon: FaLightbulb, color: 'warning', title: 'Education', text: 'Bridging the educational divide by linking students with vital resources.' }
                        ].map((item, idx) => (
                            <Col md={4} key={idx}>
                                <Card className="h-100 border-0 glass-card p-3" style={{ transition: 'transform 0.3s ease' }}>
                                    <Card.Body>
                                        <div className={`d-inline-flex p-3 rounded-circle bg-${item.color} bg-opacity-10 text-${item.color} mb-4`}>
                                            <item.icon size={32} />
                                        </div>
                                        <h4 className="fw-bold mb-3">{item.title}</h4>
                                        <p className="text-muted mb-0">{item.text}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* 3. Team Section */}
            <section className="py-5">
                <Container className="py-5">
                    <div className="text-center mb-5">
                        <h6 className="text-primary fw-bold text-uppercase letter-spacing-2">The Minds Behind HelpBridge</h6>
                        <h2 className="fw-bold display-6">Meet Our Creators</h2>
                        <p className="text-muted mt-2">A dedicated team of 5 working to bridge the gap.</p>
                    </div>

                    <Row className="justify-content-center g-4">
                        {teamMembers.map((member) => (
                            <Col key={member.id} md={6} lg={4} xl={2} style={{ minWidth: '220px' }}>
                                <div className="text-center group glass-card p-4 h-100">
                                    <div className="position-relative d-inline-block mb-3">
                                        <div className="avatar-circle rounded-circle p-1">
                                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm overflow-hidden"
                                                style={{ width: '100px', height: '100px' }}>
                                                {member.image ? (
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        className="w-100 h-100 object-fit-cover"
                                                    />
                                                ) : (
                                                    <FaUserTie size={40} className="text-dark opacity-75" />
                                                )}
                                            </div>
                                        </div>
                                        <Badge bg="primary" className="position-absolute bottom-0 end-0 rounded-circle border border-2 border-white p-2">
                                            <FaQuoteLeft size={10} />
                                        </Badge>
                                    </div>
                                    <h5 className="fw-bold text-dark mb-1">{member.name}</h5>
                                    <p className="small text-muted mb-0 d-inline-block px-3 py-1 rounded-pill mt-2 fw-medium">
                                        {member.role}
                                    </p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            <style>
                {`
                .letter-spacing-1 { letter-spacing: 1px; }
                .letter-spacing-2 { letter-spacing: 2px; }
                .hover-up:hover { transform: translateY(-10px); }
                `}
            </style>
        </div>
    );
};

export default AboutUs;
