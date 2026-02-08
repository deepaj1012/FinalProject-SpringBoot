// src/services/adminService.js

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { 'Authorization': `Bearer ${user.token}` } : {};
};

export const getDashboardSummary = async () => {
    const res = await fetch('/api/admin/dashboard-summary', {
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
};

export const getRecentActivities = async () => {
    const res = await fetch('/api/admin/recent-activities', {
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch recent activities');
    return res.json();
};

export const getStudents = async () => {
    const res = await fetch('/api/admin/users/Student', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
};

export const getVolunteers = async () => {
    const res = await fetch('/api/admin/users/Volunteer', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch volunteers');
    return res.json();
};

export const getNGOs = async () => {
    const res = await fetch('/api/admin/users/NGO', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch NGOs');
    return res.json();
};

export const getDonors = async () => {
    const res = await fetch('/api/admin/users/Donor', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch donors');
    return res.json();
};

export const approveUser = async (userId) => {
    const res = await fetch(`/api/admin/approve/${userId}`, {
        method: 'POST',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to approve user');
    return res.json();
};

export const rejectUser = async (userId) => {
    const res = await fetch(`/api/admin/reject/${userId}`, {
        method: 'POST',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to reject user');
    return res.json();
};

export const deleteUser = async (userId) => {
    const res = await fetch(`/api/admin/delete/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
};

export const suspendUser = async (userId) => {
    const res = await fetch(`/api/admin/suspend/${userId}`, {
        method: 'POST',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to suspend user');
    return res.json();
};
