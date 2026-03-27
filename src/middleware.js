import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // 1. ПУБЛИЧНЫЕ ПУТИ
    if (
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/_next') ||
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // 2. ЕСЛИ ТОКЕНА НЕТ (Выход сработал)
    if (!token) {
        // Защищаем админку и страницы книг
        if (pathname.startsWith('/admin') || pathname.startsWith('/books')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        // 3. СТРОГАЯ ЛОГИКА АДМИНА (только /admin)
        if (payload.role === 'admin') {
            if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
        }

        // 4. ЛОГИКА ЮЗЕРА (запрет в /admin)
        if (payload.role !== 'admin' && pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        // Если токен "битый" — принудительная очистка
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };