import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
    const { id } = await params;

    try {
        await db.query('DELETE FROM bookings WHERE book_id = $1', [id]);
        await db.query('DELETE FROM books WHERE id = $1', [id]);

        return NextResponse.json({ message: 'Книга и её история удалены' });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = await params;

    try {
        const { quantity } = await req.json();
        await db.query('UPDATE books SET quantity = $1 WHERE id = $2', [quantity, id]);
        return NextResponse.json({ message: 'Количество обновлено' });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
    }
}