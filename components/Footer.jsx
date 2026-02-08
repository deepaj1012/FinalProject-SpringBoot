import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart, FaHandHoldingHeart } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="hero-gradient text-white pt-5 pb-3 mt-auto">
            <Container>
                <Row className="g-4 mb-4">
                    <Col lg={6} md={6}>
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <FaHandHoldingHeart size={28} className="text-white" />
                            <h5 className="fw-bold text-white mb-0 fs-4">HelpBridge</h5>
                        </div>
                        <p className="text-white-50 small">
                            Connecting communities, empowering changes. We verify and bridge the gap between donors, volunteers, and those in need.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-white-50 hover-text-white"><FaFacebook size={20} /></a>
                            <a href="#" className="text-white-50 hover-text-white"><FaTwitter size={20} /></a>
                            <a href="#" className="text-white-50 hover-text-white"><FaInstagram size={20} /></a>
                            <a href="#" className="text-white-50 hover-text-white"><FaLinkedin size={20} /></a>
                        </div>
                    </Col>
                    <Col lg={3} md={6}>
                        <h6 className="fw-bold text-white mb-3">Quick Links</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none hover-text-white">Home</Link></li>
                            <li className="mb-2"><Link to="/about" className="text-white-50 text-decoration-none hover-text-white">About Us</Link></li>
                            <li className="mb-2"><Link to="/contact" className="text-white-50 text-decoration-none hover-text-white">Contact</Link></li>
                            <li className="mb-2"><Link to="/login" className="text-white-50 text-decoration-none hover-text-white">Login</Link></li>
                        </ul>
                    </Col>
                    <Col lg={3} md={6}>
                        <h6 className="fw-bold text-white mb-3">Roles</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2"><Link to="/register" className="text-white-50 text-decoration-none hover-text-white">Volunteer</Link></li>
                            <li className="mb-2"><Link to="/register" className="text-white-50 text-decoration-none hover-text-white">NGO</Link></li>
                            <li className="mb-2"><Link to="/register" className="text-white-50 text-decoration-none hover-text-white">Donor</Link></li>
                            <li className="mb-2"><Link to="/register" className="text-white-50 text-decoration-none hover-text-white">Student</Link></li>
                        </ul>
                    </Col>
                </Row>
                <hr className="border-secondary opacity-25" />
                <div className="text-center small text-white-50">
                    <p className="mb-0">
                        &copy; {new Date().getFullYear()} HelpBridge. Made with <FaHeart className="text-danger mx-1" /> for the community.
                    </p>
                </div>
            </Container>
            <style>
                {`
                .hover-text-white:hover { color: white !important; transition: color 0.2s ease; }
                `}
            </style>
        </footer>
    );
};

export default Footer;
