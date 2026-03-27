import db from '@/lib/db';
import { NextResponse } from 'next/server';

// Удаление книги
export async function DELETE(req, { params }) {
    // В Next.js 15+ params — это Promise
    const { id } = await params;

    try {
        await db.query('DELETE FROM books WHERE id = $1', [id]);
        return NextResponse.json({ message: 'Книга удалена' });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
    }
}

// Обновление количества
export async function PUT(req, { params }) {
    // В Next.js 15+ params — это Promise
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