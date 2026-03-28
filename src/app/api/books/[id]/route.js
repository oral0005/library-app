import db from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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
    const contentType = req.headers.get('content-type') || '';

    try {
        if (contentType.includes('application/json')) {
            const { quantity } = await req.json();
            await db.query('UPDATE books SET quantity = $1 WHERE id = $2', [quantity, id]);
            return NextResponse.json({ message: 'Количество обновлено' });
        }

        const data = await req.formData();
        const title = data.get('title');
        const author = data.get('author');
        const description = data.get('description');
        const year = data.get('year');
        const quantity = data.get('quantity');
        const file = data.get('image');

        let updateQuery = `
            UPDATE books 
            SET title = $1, author = $2, description = $3, year = $4, quantity = $5
        `;
        let values = [title, author, description, year, quantity];

        if (file && typeof file !== 'string') {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `${Date.now()}-${file.name}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads');

            try { await fs.access(uploadDir); }
            catch { await fs.mkdir(uploadDir, { recursive: true }); }

            await fs.writeFile(path.join(uploadDir, fileName), buffer);
            const image_url = `/uploads/${fileName}`;

            updateQuery += `, image_url = $6 WHERE id = $7`;
            values.push(image_url, id);
        } else {
            updateQuery += ` WHERE id = $6`;
            values.push(id);
        }

        await db.query(updateQuery, values);
        return NextResponse.json({ message: 'Книга успешно обновлена' });

    } catch (e) {
        console.error("Ошибка при обновлении книги:", e);
        return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
    }
}