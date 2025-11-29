// İlaç Takip Sistemi/src/apiClient.ts

// Bu istemci, tüm API çağrılarını standartlaştırmak için kullanılır.
// JWT token'ı local storage'da tutar ve her isteğe ekler.

const TOKEN_KEY = 'user_token';
const USER_KEY = 'current_user';

interface ApiRequestOptions extends RequestInit {
    data?: any;
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setAuthData(token: string, user: any) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getCurrentUser(): any | null {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Genel API çağrı istemcisi
 */
export async function apiClient<T = any>(
    endpoint: string,
    { method = 'GET', data, headers: customHeaders, ...customConfig }: ApiRequestOptions = {}
): Promise<T> {

    const token = getToken();

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...customHeaders,
        },
        ...customConfig,
    };

    if (token) {
        config.headers = {
            ...(config.headers as Record<string, string>),
            Authorization: `Bearer ${token}`,
        };
    }

    if (data) {
        config.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, config);

    if (!response.ok) {
        // API hatasını yakala (400, 401, 500 vb.)
        const errorData = await response.json().catch(() => ({ message: response.statusText }));

        // Eğer 401 Yetkisiz ise, kullanıcıyı otomatik olarak çıkış yapmaya zorla
        if (response.status === 401) {
            clearAuthData();
            // Yönlendirme mantığı burada React'e bırakılır
            throw new Error("Oturum süresi doldu veya yetkisiz erişim.");
        }

        throw new Error(errorData.message || 'API isteği başarısız oldu.');
    }

    // Boş yanıtları (204 No Content gibi) null olarak döndür
    if (response.status === 204 || response.headers.get('Content-Length') === '0') {
        return null as T;
    }

    return response.json() as Promise<T>;
}
