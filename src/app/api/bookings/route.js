import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { user_id, book_id } = await req.json();

        await db.query('BEGIN');

        const updateBookQuery = `
            UPDATE books 
            SET quantity = quantity - 1 
            WHERE id = $1 AND quantity > 0 
            RETURNING id, title
        `;
        const bookRes = await db.query(updateBookQuery, [book_id]);

        if (bookRes.rowCount === 0) {
            await db.query('ROLLBACK');
            return NextResponse.json({ error: 'Книги нет в наличии' }, { status: 400 });
        }

        await db.query(
            'INSERT INTO bookings (user_id, book_id) VALUES ($1, $2)',
            [user_id, book_id]
        );

        await db.query('COMMIT');

        return NextResponse.json({ message: 'Бронирование успешно оформлено' });
    } catch (e) {
        await db.query('ROLLBACK');
        console.error("Booking error:", e);
        return NextResponse.json({ error: 'Ошибка при бронировании' }, { status: 500 });
    }
}