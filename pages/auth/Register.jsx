import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [cityId, setCityId] = useState('1');
    const [certificate, setCertificate] = useState(null);
    const [coordinates, setCoordinates] = useState(null);

    const [errors, setErrors] = useState({});

    const cities = [
        { id: '1', name: 'Mumbai' },
        { id: '2', name: 'Pune' },
        { id: '3', name: 'Delhi' },
        { id: '4', name: 'Bangalore' },
        { id: '5', name: 'Chennai' }
    ];

    const { register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (location.state && location.state.role) {
            // Normalize incoming role to match Enum case
            const r = location.state.role.toLowerCase();
            if (r === 'ngo') setRole('NGO');
            else if (r === 'student') setRole('Student');
            else if (r === 'volunteer') setRole('Volunteer');
            else if (r === 'donor') setRole('Donor');
            else setRole('Student'); // Fallback
        }
    }, [location.state]);

    // Form Validation
    const validateForm = () => {
        const newErrors = {};

        // NAME only letters (no numbers, no special chars)
        if (!name.trim()) {
            newErrors.name = "Full name is required";
        } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
            newErrors.name = "Name must contain letters only";
        }

        // Email
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            newErrors.email = "Email is invalid";
        }

        // Password
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        // Confirm Password
        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm your password";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Phone Number
        if (!phoneNumber) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            newErrors.phoneNumber = "Phone number must be 10 digits";
        }

        // Certificate required
        if (!certificate) {
            newErrors.certificate = "Please upload a document";
        }

        // Live Location required for Volunteers
        if (role === 'Volunteer' && !coordinates) {
            newErrors.location = "Live location detection is mandatory for volunteers";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        const selectedCity = cities.find(c => c.id === cityId);
        const cityName = selectedCity ? selectedCity.name : '';

        const payload = { name, email, password, role, document: certificate, phoneNumber, cityId, city: cityName };
        if (coordinates) {
            payload.latitude = coordinates.lat;
            payload.longitude = coordinates.lng;
        }

        const success = await register(payload);
        if (success) {
            navigate('/login');
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)', padding: '40px 0' }}>
            <Container className="d-flex flex-column align-items-center">
                <div className="text-center mb-5">
                    <h1 className="display-3 fw-bold mb-3 text-gradient">Join HelpBridge</h1>
                    <p className="lead fs-4 text-muted">"Alone we can do so little; together we can do so much."</p>
                </div>

                <Card className="glass-card p-4" style={{ width: '600px', maxWidth: '95vw', border: 'none' }}>
                    <Card.Body>
                        <div className="text-center mb-4">
                            <h3 className="fw-bold">Create Account</h3>
                            <p className="text-muted small">Fill in the details to join our community</p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Full Name</Form.Label>
                                        <div className="position-relative">
                                            <FaUser className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                                            <Form.Control
                                                type="text"
                                                placeholder="Rohan Parab"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                className="py-3 ps-5 shadow-none border-0 bg-light"
                                                style={{ borderRadius: '0.75rem' }}
                                            />
                                        </div>
                                        {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Email Address</Form.Label>
                                        <div className="position-relative">
                                            <FaEnvelope className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                                            <Form.Control
                                                type="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="py-3 ps-5 shadow-none border-0 bg-light"
                                                style={{ borderRadius: '0.75rem' }}
                                            />
                                        </div>
                                        {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Password</Form.Label>
                                        <div className="position-relative">
                                            <FaLock className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                                            <Form.Control
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                className="py-3 ps-5 shadow-none border-0 bg-light"
                                                style={{ borderRadius: '0.75rem' }}
                                            />
                                        </div>
                                        {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                                        <div className="position-relative">
                                            <FaLock className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                                            <Form.Control
                                                type="password"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                className="py-3 ps-5 shadow-none border-0 bg-light"
                                                style={{ borderRadius: '0.75rem' }}
                                            />
                                        </div>
                                        {errors.confirmPassword && <div className="text-danger small mt-1">{errors.confirmPassword}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Phone Number</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type="tel"
                                                placeholder="Enter 10-digit contact number"
                                                value={phoneNumber}
                                                onChange={e => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    if (val.length <= 10) setPhoneNumber(val);
                                                }}
                                                className="py-3 ps-3 shadow-none border-0 bg-light"
                                                style={{ borderRadius: '0.75rem' }}
                                            />
                                        </div>
                                        {errors.phoneNumber && <div className="text-danger small mt-1">{errors.phoneNumber}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* City */}
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Select City</Form.Label>
                                        <Form.Select
                                            value={cityId}
                                            onChange={e => setCityId(e.target.value)}
                                            className="py-3 ps-3 shadow-none border-0 bg-light"
                                            style={{ borderRadius: '0.75rem' }}
                                        >
                                            {cities.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </Form.Select>
                                        {role === 'Volunteer' && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="mt-2 w-100"
                                                onClick={() => {
                                                    if (navigator.geolocation) {
                                                        navigator.geolocation.getCurrentPosition(
                                                            (pos) => {
                                                                setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                                                                alert('Location Detected! (Lat: ' + pos.coords.latitude.toFixed(4) + ')');
                                                            },
                                                            (err) => alert('Location access denied. Please enable location services.')
                                                        );
                                                    } else {
                                                        alert('Geolocation not supported');
                                                    }
                                                }}
                                            >
                                                📍 Use My Current Location (Recommended for Volunteers)
                                            </Button>
                                        )}
                                        {errors.location && <div className="text-danger small mt-1">{errors.location}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Role */}
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Select Role</Form.Label>
                                        <div className="position-relative">
                                            <FaUserTag className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                                            <Form.Select
                                                value={role}
                                                onChange={e => setRole(e.target.value)}
                                                className="py-3 ps-5 shadow-none border-0 bg-light"
                                                style={{ borderRadius: '0.75rem' }}
                                            >
                                                <option value="Student">Beneficiary</option>
                                                <option value="Volunteer">Volunteer</option>
                                                <option value="NGO">NGO</option>
                                                <option value="Donor">Donor</option>
                                            </Form.Select>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Certificate Upload */}
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            {role === 'Student' ? 'Disability Certificate' :
                                                role === 'NGO' ? 'NGO Registration Document' :
                                                    'Identity Proof'}
                                        </Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={e => setCertificate(e.target.files[0])}
                                            className="py-3 shadow-none border-0 bg-light"
                                            style={{ borderRadius: '0.75rem' }}
                                        />
                                        {errors.certificate && <div className="text-danger small mt-1">{errors.certificate}</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant="primary" type="submit" className="w-100 py-3 fs-5 mb-4 shadow-lg border-0" style={{ borderRadius: '0.75rem', background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' }}>
                                Create Account
                            </Button>

                            <div className="text-center">
                                <p className="text-muted small mb-0">
                                    Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign In</Link>
                                </p>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Register;