import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { user_id, book_id } = await req.json();
    await db.query('INSERT INTO bookings (user_id, book_id) VALUES ($1, $2)', [user_id, book_id]);
    return NextResponse.json({ message: 'Booked' });
}