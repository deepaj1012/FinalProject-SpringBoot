import React from 'react';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
    const location = useLocation();
    // Hide footer on login, register, and admin routes if needed (user asked for login/register specifically)
    const hideFooterPaths = ['/login', '/register'];
    const showFooter = !hideFooterPaths.includes(location.pathname);

    return (
        <div className="d-flex flex-column min-vh-100">
            <AppNavbar />
            <div className="flex-grow-1">
                <Outlet />
            </div>
            {showFooter && <Footer />}
        </div>
    );
};

export default MainLayout;
