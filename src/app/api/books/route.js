import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');

        let query = 'SELECT * FROM books';
        let values = [];

        if (search) {
            // Поиск по названию ИЛИ по автору
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