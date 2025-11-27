// İlaç Takip Sistemi/src/api.ts

// Uygulamanın Backend API adresleri
const BASE_URL = "/api";

export const API_ENDPOINTS = {
    // Auth (Giriş/Çıkış)
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,

    // İlaçlar ve Stok (Eczacı Paneli)
    MEDICATIONS: `${BASE_URL}/medication/`,
    REGISTER_MEDICATION: `${BASE_URL}/medication/register`,

    // Reçeteler ve Takip (Hasta Paneli)
    PRESCRIPTIONS: `${BASE_URL}/prescription/`,
    TAKE_DOSE: `${BASE_URL}/prescription/take`,
};
