import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    // JOIN для объединения данных пользователя, книги и статуса
    const query = `
    SELECT bk.id, bk.booking_date, bk.status, u.email as user_email, b.title as book_title
    FROM bookings bk
    JOIN users u ON bk.user_id = u.id
    JOIN books b ON bk.book_id = b.id
    ORDER BY bk.booking_date DESC
  `;
    const { rows } = await db.query(query);
    return NextResponse.json(rows);
}