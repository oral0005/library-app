import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('token')?.value;

    if (request.nextUrl.pathname.startsWith('/admin')) {
        // В реальном проекте здесь используется библиотека jose для проверки JWT в Edge runtime
        if (!token) return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };