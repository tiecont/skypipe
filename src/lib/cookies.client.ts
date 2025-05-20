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

export function setClientCookie(
    name: string,
    value: string,
    options?: { days?: number; minutes?: number }
) {
    if (typeof window !== 'undefined') {
        let expires = '';
        if (options?.days || options?.minutes) {
            const date = new Date();
            const totalMs =
                (options.days || 0) * 24 * 60 * 60 * 1000 +
                (options.minutes || 0) * 60 * 1000;
            date.setTime(date.getTime() + totalMs);
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