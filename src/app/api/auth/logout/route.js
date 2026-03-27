import { NextResponse } from 'next/server';

export async function POST() {
    const res = NextResponse.json({ message: 'Logged out' });
    // Удаляем куку с токеном
    res.cookies.delete('token');
    return res;
}