// src/components/RequireAdmin.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrapper that only renders children if the user has the "admin" role.
// Otherwise redirects to home (or login if not authenticated).
const RequireAdmin = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default RequireAdmin;
