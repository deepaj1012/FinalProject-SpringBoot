// src/services/ngoService.js

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const getMyDonationNeeds = async (ngoId) => {
    const res = await fetch(`/api/help-posts/ngo/${ngoId}`, {
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch donation needs');
    return res.json();
};

export const postDonationNeed = async (needData, ngoId) => {
    const res = await fetch(`/api/help-posts/${ngoId}`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(needData)
    });
    if (!res.ok) throw new Error('Failed to post donation need');
    return res.json();
};

export const markRequestCompleted = async (postId) => {
    const res = await fetch(`/api/help-posts/${postId}/complete`, {
        method: 'POST',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to mark request completed');
    return res.json();
};

export const getDashboardStats = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        let reqUrl = '/api/requests/all';
        if (user && (user.role === 'NGO' || user.Role === 'NGO')) {
            const id = user.userId || user.id;
            if (id) reqUrl += `?ngoId=${id}`;
        }

        const [reqRes, volRes] = await Promise.all([
            fetch(reqUrl, { headers: getAuthHeader() }),
            fetch('/api/admin/users/Volunteer', { headers: getAuthHeader() }) // This endpoint might need safety check if not Admin
        ]);

        const requests = reqRes.ok ? await reqRes.json() : [];
        const volunteers = volRes.ok ? await volRes.json() : [];

        const pending = requests.filter(r => r.status === 'PENDING' || r.status === 'Pending').length;
        const ongoing = requests.filter(r => ['ACCEPTED', 'ASSIGNED', 'IN_PROGRESS', 'Accepted', 'Assigned', 'InProgress'].includes(r.status)).length;
        const completed = requests.filter(r => r.status === 'COMPLETED' || r.status === 'Completed').length;

        // Calculate funds
        const fundsAllocated = requests.reduce((acc, r) => acc + (r.fundsAllocated || 0), 0);
        // Assuming simplistic mock for raised funds or deriving from posts if available. For now 0 or hardcoded budget.

        return {
            pendingRequests: pending,
            ongoingRequests: ongoing,
            completedRequests: completed,
            activeVolunteers: volunteers.length,
            totalFundsRaised: 0, // Placeholder
            fundsAllocated: fundsAllocated,
            balanceFunds: 0
        };
    } catch (e) {
        console.error("Stats calculation failed", e);
        return {
            pendingRequests: 0, ongoingRequests: 0, completedRequests: 0, activeVolunteers: 0, totalFundsRaised: 0, fundsAllocated: 0, balanceFunds: 0
        };
    }
};

export const getHelpRequests = async (filter) => {
    // Fetch all requests and filter client side for now as backend 'all' returns list
    const user = JSON.parse(localStorage.getItem('user'));
    let url = '/api/requests/all';

    // Robust check for NGO role and User ID
    if (user && (user.role === 'NGO' || user.Role === 'NGO')) {
        const id = user.userId || user.id;
        if (id) {
            url += `?ngoId=${id}`;
        }
    }

    const res = await fetch(url, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch requests');
    const all = await res.json();

    if (filter === 'pending') return all.filter(r => r.status === 'PENDING');
    if (filter === 'ongoing') return all.filter(r => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED');
    if (filter === 'completed') return all.filter(r => r.status === 'COMPLETED');
    return all;
};

export const getVolunteers = async (city) => {
    // Reuse Admin API if NGO has permission, OR add endpoint. 
    // Usually Admin APIs are protected. We need an endpoint for NGO to see volunteers.
    // Assuming RequestController doesn't have it.
    // Let's try calling admin one, if it fails (403), we return empty list.
    try {
        let url = '/api/admin/users/Volunteer';
        if (city) url += `?city=${encodeURIComponent(city)}`;
        const res = await fetch(url, { headers: getAuthHeader() });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        return [];
    }
};

export const acceptRequest = async (requestId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const ngoId = user ? user.userId : null;
    const res = await fetch(`/api/requests/${requestId}/accept?ngoId=${ngoId}`, {
        method: 'POST',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to accept request');
    return res.json();
};

export const assignVolunteer = async (requestId, volunteerId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const ngoId = user ? user.userId : null;
    const res = await fetch(`/api/requests/${requestId}/assign/${volunteerId}?ngoId=${ngoId}`, {
        method: 'POST',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to assign volunteer');
    return res.json();
};

export const allocateFunds = async (requestId, amount) => {
    const res = await fetch(`/api/requests/${requestId}/funds`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(parseFloat(amount))
    });
    if (!res.ok) throw new Error('Failed to allocate funds');
    return res.json();
};

export const deleteHelpRequest = async (requestId) => {
    const res = await fetch(`/api/requests/${requestId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to delete request');
    return res.json();
};
