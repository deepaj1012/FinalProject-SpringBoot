import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Form, Alert, ProgressBar } from 'react-bootstrap';
import { FaHandHoldingHeart, FaFilter, FaRupeeSign, FaSearch, FaGlobeAmericas } from 'react-icons/fa';
import { getDonationNeeds, createDonationOrder, verifyDonationPayment, getRazorpayKey } from '../../services/donorService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DonorDashboard = () => {
    const [needs, setNeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({ city: '', category: '' });

    // Load Razorpay Script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const fetchData = async () => {
        try {
            const data = await getDonationNeeds();
            setNeeds(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDonate = async (need) => {
        const amount = prompt(`Enter donation amount for ${need.title} (₹):`);
        if (!amount || isNaN(amount) || amount <= 0) return;

        const res = await loadRazorpay();
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            // 0. Fetch Key
            const key = await getRazorpayKey();

            // 1. Create Order on Backend
            const orderData = await createDonationOrder(need.id, parseFloat(amount));

            // CHECK FOR MOCK MODE
            if (orderData.mock) {
                if (window.confirm(`⚠️ DEMO MODE: Backend keys are missing.\n\nSimulate successful payment of ₹${amount}?`)) {
                    const verifyPayload = {
                        razorpay_order_id: orderData.id,
                        razorpay_payment_id: "pay_mock_" + Date.now(),
                        razorpay_signature: "mock_signature",
                        campaign_id: need.id,
                        amount: parseFloat(amount)
                    };
                    const user = JSON.parse(localStorage.getItem('user'));
                    const userId = user ? user.userId : null;
                    await verifyDonationPayment(verifyPayload, userId);
                    alert("Mock Payment Successful!");
                    fetchData();
                }
                return;
            }

            // 2. Open Razorpay Options
            const options = {
                key: key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "HelpBridge",
                description: `Donation for ${need.title}`,
                image: "https://example.com/your_logo", // You can replace this
                order_id: orderData.id,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        const verifyPayload = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            campaign_id: need.id,
                            amount: parseFloat(amount)
                        };

                        const user = JSON.parse(localStorage.getItem('user'));
                        const userId = user ? user.userId : null;

                        await verifyDonationPayment(verifyPayload, userId);
                        alert("Payment Successful! Thank you for your donation.");
                        fetchData(); // Refresh progress
                    } catch (err) {
                        alert("Payment Verification Failed: " + err.message);
                    }
                },
                prefill: {
                    name: "Donor Name", // Could fill from user profile
                    email: "donor@example.com",
                    contact: "9999999999"
                },
                notes: {
                    address: "HelpBridge Office"
                },
                theme: {
                    color: "#3399cc"
                },
                // Force UPI Only configuration
                config: {
                    display: {
                        blocks: {
                            banks: {
                                name: "Pay via UPI",
                                instruments: [
                                    {
                                        method: "upi"
                                    }
                                ]
                            }
                        },
                        sequence: ["block.banks"],
                        preferences: {
                            show_default_blocks: false
                        }
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert(response.error.description);
            });
            rzp1.open();

        } catch (err) {
            console.error(err);
            alert('Error initiating payment: ' + err.message);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="fade-in py-5" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)', minHeight: '90vh' }}>
            <Container>
                <div className="mb-5">
                    <h1 className="display-4 fw-bold mb-2">Donor <span className="text-gradient">Dashboard</span></h1>
                    <p className="text-muted fs-5">Your contributions make a real world impact. Support a cause today.</p>
                </div>

                {error && <Alert variant="danger" className="rounded-xl shadow-sm">{error}</Alert>}

                {/* Filters */}
                <Card className="glass-card mb-5 p-3 border-0 shadow-sm">
                    <Card.Body>
                        <Row className="align-items-center g-3">
                            <Col md={1} className="text-center d-none d-md-block">
                                <FaFilter className="text-primary fs-4" />
                            </Col>
                            <Col md={4}>
                                <div className="position-relative">
                                    <FaGlobeAmericas className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                                    <Form.Select
                                        className="py-3 ps-5 shadow-none border-0 bg-gray-100"
                                        onChange={(e) => setFilter({ ...filter, city: e.target.value })}
                                    >
                                        <option value="">All Cities</option>
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Pune">Pune</option>
                                    </Form.Select>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="position-relative">
                                    <FaSearch className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                                    <Form.Select
                                        className="py-3 ps-5 shadow-none border-0 bg-gray-100"
                                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                                    >
                                        <option value="">All Categories</option>
                                        <option value="Clothes">Clothes</option>
                                        <option value="Food">Food</option>
                                        <option value="Medical">Medical</option>
                                    </Form.Select>
                                </div>
                            </Col>
                            <Col md={3}>
                                <Button variant="primary" className="w-100 py-3 fw-bold shadow-sm">Apply Filters</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Needs Grid */}
                <Row className="g-4">
                    {needs.length === 0 ? (
                        <Col xs={12}>
                            <Card className="glass-card text-center p-5">
                                <p className="text-muted mb-0">No active donation needs found at the moment.</p>
                            </Card>
                        </Col>
                    ) : (
                        needs.map(need => {
                            const progress = Math.min((need.collectedAmount / need.targetAmount) * 100, 100);
                            return (
                                <Col xs={12} md={6} lg={4} key={need.id}>
                                    <Card className="glass-card h-100 p-3 transition-all hover-translate-y">
                                        <Card.Body className="d-flex flex-column">
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <div className="bg-soft-danger p-2 rounded-circle">
                                                    <FaHandHoldingHeart className="text-danger" />
                                                </div>
                                                <div>
                                                    <h5 className="fw-bold mb-0">{need.title}</h5>
                                                    <small className="text-muted">{need.ngoName || 'NGO Partner'}</small>
                                                </div>
                                            </div>
                                            <Card.Text className="text-muted small mb-4 flex-grow-1">
                                                {need.description}
                                            </Card.Text>

                                            <div className="mb-2 d-flex justify-content-between small fw-bold">
                                                <span>Raised</span>
                                                <span className="text-primary">₹{need.collectedAmount} / ₹{need.targetAmount}</span>
                                            </div>
                                            <ProgressBar
                                                now={progress}
                                                variant={progress >= 100 ? "success" : "primary"}
                                                className="rounded-pill mb-4"
                                                style={{ height: '8px' }}
                                            />

                                            <Button
                                                variant="primary"
                                                className="w-100 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                                onClick={() => handleDonate(need)}
                                            >
                                                <FaRupeeSign /> Donate Now
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default DonorDashboard;
