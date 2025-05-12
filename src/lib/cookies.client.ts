export function getClientCookie(key: string): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === key) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

export function setClientCookie(name: string, value: string, days?: number) {
    if (typeof window !== 'undefined') {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }
}

export function deleteClientCookie(name: string) {
    if (typeof window !== 'undefined') {
        document.cookie = name + '=; Max-Age=-99999999; path=/';
    }
}