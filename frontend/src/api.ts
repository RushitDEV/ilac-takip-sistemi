// src/api.ts

const BASE_URL = "http://localhost/api";

export const API_ENDPOINTS = {
    // AUTH
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,

    // DASHBOARD
    DASHBOARD_STATS: `${BASE_URL}/dashboard/stats`,

    // MEDICATIONS
    MEDICATION_CREATE: `${BASE_URL}/medication`,
    MEDICATION_LIST: `${BASE_URL}/medication`,
    MEDICATION_DETAIL: (id: string) => `${BASE_URL}/medication/${id}`,
    MEDICATION_UPDATE: (id: string) => `${BASE_URL}/medication/${id}`,
    MEDICATION_DELETE: (id: string) => `${BASE_URL}/medication/${id}`,

    // PATIENTS
    PATIENTS: `${BASE_URL}/patient`,
    PATIENT_DETAIL: (id: string) => `${BASE_URL}/patient/${id}`,
    PATIENT_UPDATE: (id: string) => `${BASE_URL}/patient/${id}`,
    PATIENT_DELETE: (id: string) => `${BASE_URL}/patient/${id}`,
    // PATIENT TRACKING (Eczacı Paneli)
    PATIENT_TRACKING_LIST: `${BASE_URL}/patient-tracking/patients`,
    PATIENT_PRESCRIPTIONS: (id: number) =>
        `${BASE_URL}/patient-tracking/${id}/prescriptions`,


    // PRESCRIPTIONS (Hasta Paneli)
    PRESCRIPTIONS: `${BASE_URL}/prescription`,
    TAKE_DOSE: `${BASE_URL}/prescription/take`,
    PRESCRIPTION_CREATE: `${BASE_URL}/prescription`,
    // PRESCRIPTIONS
    PRESCRIPTION_LIST_BY_PATIENT: (id: string) =>
        `${BASE_URL}/prescription/patient/${id}`,

    PRESCRIPTION_DELETE: (id: string) =>
        `${BASE_URL}/prescription/${id}`,


    // STOCK
    STOCK_LIST: `${BASE_URL}/stock`,
    STOCK_ADD: `${BASE_URL}/stock/add`,
    STOCK_REMOVE: `${BASE_URL}/stock/remove`,

    // SHIPMENT
    SHIPMENT_LIST: `${BASE_URL}/shipment`,
    SHIPMENT_CREATE: `${BASE_URL}/shipment/create`,
    SHIPMENT_UPDATE: (id: string) => `${BASE_URL}/shipment/${id}/update-status`,

    // NOTIFICATIONS
    NOTIFICATION_LIST: `${BASE_URL}/notifications`,
    NOTIFICATION_MARK_READ: (id: string) => `${BASE_URL}/notifications/mark-read/${id}`,
    NOTIFICATION_GENERATE_STOCK: `${BASE_URL}/notifications/generate/stock`,
    NOTIFICATION_GENERATE_SHIPMENT: `${BASE_URL}/notifications/generate/shipment`,

    // LIFE CYCLE
    LIFECYCLE_ALL: `${BASE_URL}/lifecycle/all`,
};
