// src/services/studentService.js

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const getMyRequests = async (studentId) => {
    const res = await fetch(`/api/requests/student/${studentId}`, {
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
};

export const createRequest = async (requestData) => {
    const res = await fetch('/api/requests', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(requestData)
    });
    if (!res.ok) throw new Error('Failed to create request');
    return res.json();
};
