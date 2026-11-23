let accessToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;

export function getAccessToken() {
    return accessToken;
}

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export async function refreshAccessToken(): Promise<boolean> {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                accessToken = null;
                return false;
            }

            const data = await response.json();
            accessToken = data.accessToken || null;
            return Boolean(accessToken);
        } catch {
            accessToken = null;
            return false;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

export async function apiFetch(
    input: RequestInfo | URL,
    init: RequestInit = {}
): Promise<Response> {
    const send = (token: string | null) => {
        const headers = new Headers(init.headers);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return fetch(input, {
            ...init,
            headers,
            credentials: 'include'
        });
    };

    let response = await send(accessToken);
    if (response.status !== 401) {
        return response;
    }

    const refreshed = await refreshAccessToken();
    if (!refreshed) {
        return response;
    }

    return send(accessToken);
}
