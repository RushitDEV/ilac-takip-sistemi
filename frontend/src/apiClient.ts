const TOKEN_KEY = "token";       // 🔥 DÜZELTİLDİ
const USER_KEY = "current_user";

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
    const json = localStorage.getItem(USER_KEY);
    return json ? JSON.parse(json) : null;
}

export async function apiClient<T = any>(
    endpoint: string,
    { method = "GET", data, headers, ...rest }: ApiRequestOptions = {}
): Promise<T> {

    const token = getToken();

    const finalHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(headers as any),
    };

    if (token) {
        finalHeaders["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
        method,
        headers: finalHeaders,
        body: data ? JSON.stringify(data) : undefined,
        ...rest,
    });

    if (response.status === 401) {
        clearAuthData();
        throw new Error("JWT token geçersiz veya süresi dolmuş.");
    }

    if (!response.ok) {
        let errorMsg = "API error";
        try {
            const err = await response.json();
            errorMsg = err.message || JSON.stringify(err);
        } catch (_) {}
        throw new Error(errorMsg);
    }

    if (response.status === 204) return null as T;

    return response.json();
}
