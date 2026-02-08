import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Unified login: calls backend API
    const login = async (email, password) => {
        try {
            const res = await fetch('/api/account/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Login failed' }));
                alert(errorData.message || errorData.error || errorData.title || 'Login failed');
                throw new Error(errorData.message || errorData.error || 'Login failed');
            }

            const data = await res.json();
            // Normalize role and token properties
            const normalizedUser = {
                ...data,
                role: data.role || data.Role || '',
                token: data.token || data.Token || ''
            };
            setUser(normalizedUser);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            return normalizedUser;
        } catch (err) {
            alert('Server error during login');
            return null;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Register a new user via backend API
    const register = async (userData) => {
        try {
            // Use FormData for multipart uploads
            const formData = new FormData();
            formData.append('FullName', userData.name);
            formData.append('Email', userData.email);
            formData.append('Password', userData.password);
            formData.append('Role', userData.role);
            formData.append('CityId', userData.cityId || 1);

            if (userData.document) {
                formData.append('Document', userData.document);
            }
            if (userData.phoneNumber) {
                formData.append('PhoneNumber', userData.phoneNumber);
            }
            if (userData.latitude && userData.longitude) {
                formData.append('Latitude', userData.latitude);
                formData.append('Longitude', userData.longitude);
            }
            if (userData.cityId) {
                formData.append('CityId', userData.cityId);
            }
            if (userData.city) { // Capture City Name for text-based filtering
                formData.append('City', userData.city);
            }

            const res = await fetch('/api/account/register', {
                method: 'POST',
                // No 'Content-Type' header, browser will set it with boundary
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Registration failed' }));
                alert(errorData.message || 'Registration failed');
                return;
            }

            if (userData.role.toLowerCase() === 'donor') {
                alert('Registration successful! You can now login.');
            } else {
                alert('Registration successful! Please wait for Admin Approval before logging in.');
            }
            return true;
        } catch (err) {
            alert('Server error during registration');
            return false;
        }
    };


    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const role = parsedUser.role || parsedUser.Role;
            const token = parsedUser.token || parsedUser.Token;
            if (role) {
                const normalizedUser = {
                    ...parsedUser,
                    role: role,
                    token: token || ''
                };
                setUser(normalizedUser);
            } else {
                localStorage.removeItem('user');
                setUser(null);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
