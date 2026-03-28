import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function GET(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const query = `
            SELECT bk.id, bk.booking_date, b.title as book_title
            FROM bookings bk
            JOIN books b ON bk.book_id = b.id
            WHERE bk.user_id = $1
            ORDER BY bk.booking_date DESC
        `;
        const { rows } = await db.query(query, [payload.id]);

        return NextResponse.json(rows);
    } catch (e) {
        console.error("API History Error:", e);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}