import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHandHoldingHeart } from 'react-icons/fa';

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar expand="lg" className="glass-nav sticky-top py-3">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                    <FaHandHoldingHeart size={32} className="text-primary" />
                    <span className="text-gradient" style={{ fontWeight: '800', fontSize: '1.6rem' }}>HelpBridge</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center gap-3">
                        <Nav.Link as={Link} to="/" className="px-3">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="px-3">About</Nav.Link>
                        <Nav.Link as={Link} to="/contact" className="px-3">Contact</Nav.Link>
                        {!user && (
                            <>
                                <Nav.Link as={Link} to="/login" className="px-3 d-lg-none">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="px-3 d-lg-none">Register</Nav.Link>
                            </>
                        )}
                        {user && (
                            <Nav.Link onClick={handleLogout} className="px-3 d-lg-none text-danger">Logout</Nav.Link>
                        )}

                        {user && user.role.toLowerCase() === 'admin' && (
                            <Nav.Link as={Link} to="/admin" className="px-3">Admin Panel</Nav.Link>
                        )}
                        {user && user.role.toLowerCase() === 'student' && (
                            <Nav.Link as={Link} to="/student" className="px-3">Dashboard</Nav.Link>
                        )}
                        {user && user.role.toLowerCase() === 'volunteer' && (
                            <Nav.Link as={Link} to="/volunteer" className="px-3">Dashboard</Nav.Link>
                        )}
                        {user && user.role.toLowerCase() === 'ngo' && (
                            <Nav.Link as={Link} to="/ngo" className="px-3">Dashboard</Nav.Link>
                        )}
                        {user && user.role.toLowerCase() === 'donor' && (
                            <Nav.Link as={Link} to="/donor" className="px-3">Dashboard</Nav.Link>
                        )}

                        {!user ? (
                            <div className="d-flex gap-2 ms-lg-3">
                                <Button as={Link} to="/login" variant="link" className="text-decoration-none text-gray-700 fw-semibold px-3">Login</Button>
                                <Button as={Link} to="/register" variant="primary" className="px-4 shadow-sm">Get Started</Button>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-3 ms-lg-3">
                                <div className="d-none d-sm-block text-end">
                                    <div className="fw-bold text-gray-900 small">{user.name || user.fullName}</div>
                                    <div className="text-muted small text-capitalize">{user.role}</div>
                                </div>
                                <Button variant="outline-danger" size="sm" onClick={handleLogout} className="px-3">Logout</Button>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
