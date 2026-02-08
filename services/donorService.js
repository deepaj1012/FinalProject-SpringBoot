// src/services/donorService.js

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const getDonationNeeds = async () => {
    const res = await fetch('/api/help-posts', {
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch donation needs');
    return res.json();
};

export const donate = async (donationData) => {
    // donationData: { donationRequestId: id, amount: val }
    const res = await fetch(`/api/help-posts/${donationData.donationRequestId}/donate?amount=${donationData.amount}`, {
        method: 'POST',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to process donation');
    return res.json();
};

export const createDonationOrder = async (campaignId, amount) => {
    const res = await fetch(`/api/payment/create-order/${campaignId}`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ amount })
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to create payment order');
    }
    return res.json();
};

export const verifyDonationPayment = async (paymentData, userId) => {
    let url = `/api/payment/verify`;
    if (userId) url += `?userId=${userId}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(paymentData)
    });
    if (!res.ok) throw new Error('Payment verification failed');
    return res.json();
};

export const getRazorpayKey = async () => {
    const res = await fetch('/api/payment/key', {
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch Razorpay key');
    const data = await res.json();
    return data.key;
};
