import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;


    if (
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/uploads') ||
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    if (!token) {
        // Добавлена защита для /history
        if (pathname.startsWith('/admin') || pathname.startsWith('/books') || pathname.startsWith('/history')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (payload.role === 'admin') {
            if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
        }

        if (payload.role !== 'admin' && pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };