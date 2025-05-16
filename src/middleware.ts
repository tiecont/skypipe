import { NextRequest, NextResponse } from 'next/server';
import { KEY_COOKIES } from './lib/constants/auth.constants';
import { ROUTES } from './lib/constants/routes.contants';

const PUBLIC_AUTH_ROUTES = [ROUTES.AUTH_SIGNIN];

const setLocaleCookieIfMissing = (request: NextRequest, response: NextResponse) => {
    const hasLocale = request.cookies.has(KEY_COOKIES.LOCALE);
    if (!hasLocale) {
        const preferredLang = request.headers.get('accept-language')?.includes('vi') ? 'vi' : 'en';
        response.cookies.set(KEY_COOKIES.LOCALE, preferredLang, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365 * 20, // 20 years
        });
    }
};

const shouldRedirectToHome = (pathname: string): boolean => {
    return PUBLIC_AUTH_ROUTES.includes(pathname) || pathname.startsWith(ROUTES.AUTH);
};

const middleware = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(KEY_COOKIES.TOKEN)?.value;
    const response = NextResponse.next();

    // Handle Language Cookie
    setLocaleCookieIfMissing(request, response);

    // Authenticated users visiting auth pages (e.g. /login) → redirect to home
    if (token && shouldRedirectToHome(pathname)) {
        return NextResponse.redirect(new URL(ROUTES.MAIN, request.url));
    }

    // Unauthenticated access to protected pages → redirect to sign in
    const isPublicPath = shouldRedirectToHome(pathname) || pathname === ROUTES.HOME;
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL(ROUTES.AUTH_SIGNIN, request.url));
    }

    return response;
};

export default middleware;

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images|favicon.png).*)'],
};
