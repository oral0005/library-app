import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies(); // Обязательный await
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return NextResponse.json({ user: payload });
    } catch (e) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}