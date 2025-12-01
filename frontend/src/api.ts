const BASE_URL = "http://localhost/api";

export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,

    // Dashboard
    DASHBOARD_STATS: `${BASE_URL}/dashboard/stats`,

    // Medications (Eczacı Paneli)
    MEDICATION_CREATE: `${BASE_URL}/medication`,
    MEDICATION_LIST: `${BASE_URL}/medication`,
    MEDICATION_DETAIL: (id: string) => `${BASE_URL}/medication/${id}`,
    MEDICATION_UPDATE: (id: string) => `${BASE_URL}/medication/${id}`,
    MEDICATION_DELETE: (id: string) => `${BASE_URL}/medication/${id}`,

    // Prescriptions (Hasta Paneli)
    PRESCRIPTIONS: `${BASE_URL}/prescription`,
    TAKE_DOSE: `${BASE_URL}/prescription/take`,

    //Stock
    STOCK_LIST: "/api/stock",
    STOCK_ADD: "/api/stock/add",
    STOCK_REMOVE: "/api/stock/remove",

    //Patient Tracking
    PATIENT_LIST: "/api/patient-tracking/patients",
    PATIENT_PRESCRIPTIONS: (patientId: string) =>
        `/api/patient-tracking/${patientId}/prescriptions`,
    PRESCRIPTION_DOSES: (prescriptionId: string) =>
        `/api/patient-tracking/prescription/${prescriptionId}/doses`,

    //Shipment
    SHIPMENT_LIST: "/api/shipment",
    SHIPMENT_CREATE: "/api/shipment/create",
    SHIPMENT_UPDATE: (id: string) => `/api/shipment/${id}/update-status`,

    //Bildirim
    NOTIFICATION_LIST: "/api/notifications",
    NOTIFICATION_MARK_READ: (id: string) => `/api/notifications/mark-read/${id}`,

    NOTIFICATION_GENERATE_STOCK: "/api/notifications/generate/stock",
    NOTIFICATION_GENERATE_SHIPMENT: "/api/notifications/generate/shipment",

    //life cycle
    LIFECYCLE_ALL: "/api/lifecycle/all",
};
