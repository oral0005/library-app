import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { rows } = await db.query('SELECT * FROM books WHERE id = $1', [params.id]);
    return NextResponse.json(rows[0]);
}

export async function DELETE(req, { params }) {
    await db.query('DELETE FROM books WHERE id = $1', [params.id]);
    return NextResponse.json({ message: 'Deleted' });
}