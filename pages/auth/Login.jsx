import React, { useState } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role for demo
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // No role selector UI needed; role defaults to 'student' or can be set via navigation state
    React.useEffect(() => {
        if (location.state && location.state.role) {
            setRole(location.state.role);
        }
    }, [location.state]);

    const handleSubmit = async e => {
        e.preventDefault();
        const loggedInUser = await login(email, password, role);

        if (loggedInUser) {
            const userRole = loggedInUser.role.toLowerCase();
            // Redirect based on role
            if (userRole === 'admin') navigate('/admin');
            else if (userRole === 'student') navigate('/student');
            else if (userRole === 'volunteer') navigate('/volunteer');
            else if (userRole === 'ngo') navigate('/ngo');
            else if (userRole === 'donor') navigate('/donor');
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)' }}>
            <Container className="d-flex flex-column align-items-center">
                <div className="text-center mb-5">
                    <h1 className="display-3 fw-bold mb-3 text-gradient">Welcome Back</h1>
                    <p className="lead fs-4 text-muted">"We rise by lifting others."</p>
                </div>

                <Card className="glass-card p-4" style={{ width: '450px', maxWidth: '95vw', border: 'none' }}>
                    <Card.Body>
                        <div className="text-center mb-4">
                            <h3 className="fw-bold">Login</h3>
                            <p className="text-muted small">Enter your credentials to access your account</p>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label className="fw-semibold">Email Address</Form.Label>
                                <div className="position-relative">
                                    <FaEnvelope className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                                    <Form.Control
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className="py-3 ps-5 shadow-none border-0 bg-light"
                                        style={{ borderRadius: '0.75rem' }}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="password">
                                <Form.Label className="fw-semibold">Password</Form.Label>
                                <div className="position-relative">
                                    <FaLock className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                                    <Form.Control
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        className="py-3 ps-5 shadow-none border-0 bg-light"
                                        style={{ borderRadius: '0.75rem' }}
                                    />
                                </div>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 py-3 fs-5 mb-4 shadow-lg border-0" style={{ borderRadius: '0.75rem', background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' }}>
                                Sign In
                            </Button>

                            <div className="text-center">
                                <p className="text-muted small mb-0">
                                    Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Create one</Link>
                                </p>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Login;
