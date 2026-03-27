import db from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');

        let query = 'SELECT * FROM books';
        let values = [];

        if (search) {
            query += ` WHERE title ILIKE $1 OR author ILIKE $1`;
            values = [`%${search}%`];
        }

        query += ' ORDER BY id DESC';

        const { rows } = await db.query(query, values);
        return NextResponse.json(rows);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const data = await req.formData();

        // Извлекаем текстовые поля из FormData
        const title = data.get('title');
        const author = data.get('author');
        const description = data.get('description');
        const year = data.get('year');
        const quantity = data.get('quantity');

        // Работа с файлом
        const file = data.get('image');
        let image_url = '';

        if (file && typeof file !== 'string') {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Создаем уникальное имя файла
            const fileName = `${Date.now()}-${file.name}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads');

            // Проверяем наличие папки, если нет — создаем
            try {
                await fs.access(uploadDir);
            } catch {
                await fs.mkdir(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, fileName);
            await fs.writeFile(filePath, buffer);
            image_url = `/uploads/${fileName}`;
        }

        const query = `
            INSERT INTO books (title, author, description, year, quantity, image_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [title, author, description, year, quantity, image_url];

        const { rows } = await db.query(query, values);
        return NextResponse.json(rows[0], { status: 201 });
    } catch (e) {
        console.error("Ошибка при создании книги:", e);
        return NextResponse.json({ error: 'Ошибка при создании книги' }, { status: 500 });
    }
}