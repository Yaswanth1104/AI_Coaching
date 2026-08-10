import axios from "axios";


// ==========================================================
// Axios Instance
// ==========================================================

const api = axios.create({

    baseURL: "http://127.0.0.1:5000",

    headers: {
        "Content-Type": "application/json"
    }

});


// ==========================================================
// Analyze Customer Message
// ==========================================================

export const analyzeMessage = async (
    message,
    sessionId
) => {

    const response = await api.post(
        "/analyze",
        {
            message,
            session_id: sessionId
        }
    );

    return response.data;
};


// ==========================================================
// Simulate Customer
// ==========================================================

export const simulateCustomer = async (
    scenario,
    persona
) => {

    const response = await api.post(
        "/simulate",
        {
            scenario,
            persona
        }
    );

    return response.data;
};


// ==========================================================
// Analytics
// ==========================================================

export const getAnalytics = async () => {

    const response = await api.get(
        "/analytics"
    );

    return response.data;
};


// ==========================================================
// Conversation History
// ==========================================================

export const getHistory = async () => {

    const response = await api.get(
        "/history"
    );

    return response.data;
};


// ==========================================================
// Get One Conversation Report
// ==========================================================

export const getReport = async (
    reportId
) => {

    const response = await api.get(
        `/history/${reportId}`
    );

    return response.data;
};


// ==========================================================
// Delete One Conversation Report
// ==========================================================

export const deleteReport = async (
    reportId
) => {

    const response = await api.delete(
        `/history/${reportId}`
    );

    return response.data;
};


// ==========================================================
// Health Check
// ==========================================================

export const getHealth = async () => {

    const response = await api.get(
        "/health"
    );

    return response.data;
};


// ==========================================================
// Default Export
// ==========================================================

export default api;