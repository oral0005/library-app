import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const { rows } = await db.query('SELECT * FROM books');
    return NextResponse.json(rows);
}

export async function POST(req) {
    const { title, author } = await req.json();
    await db.query('INSERT INTO books (title, author) VALUES ($1, $2)', [title, author]);
    return NextResponse.json({ message: 'Book added' });
}