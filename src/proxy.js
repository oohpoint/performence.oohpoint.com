import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login'];

export function proxy(request) {
    const { pathname } = request.nextUrl;

    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    const token = request.cookies.get('authToken')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
