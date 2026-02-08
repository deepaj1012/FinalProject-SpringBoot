// src/services/volunteerService.js

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const getNearbyRequests = async (city) => {
    const res = await fetch(`/api/requests/nearby?city=${city}`, {
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch nearby requests');
    return res.json();
};

export const getMyTasks = async (volunteerId) => {
    const res = await fetch(`/api/requests/volunteer/${volunteerId}`, {
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch my tasks');
    return res.json();
};

export const acceptRequest = async (requestId, volunteerId) => {
    const res = await fetch(`/api/requests/${requestId}/accept/${volunteerId}`, {
        method: 'POST',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to accept request');
    return res.json();
};

export const volunteerAcceptAssignment = async (requestId) => {
    const res = await fetch(`/api/requests/${requestId}/volunteer-accept`, {
        method: 'POST',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to accept assignment');
    return res.json();
};

export const volunteerRejectAssignment = async (requestId) => {
    const res = await fetch(`/api/requests/${requestId}/reject`, {
        method: 'POST',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to reject assignment');
    return res.json();
};

export const completeRequest = async (requestId) => {
    const res = await fetch(`/api/requests/${requestId}/complete`, {
        method: 'POST',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to complete request');
    return res.json();
};
