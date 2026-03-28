import db from '@/lib/db';
import bcrypt from 'bcrypt';
import { signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if (user && await bcrypt.compare(password, user.password_hash)) {
            const token = signToken({ id: user.id, role: user.role, email: user.email });
            const res = NextResponse.json({ message: 'Logged in', role: user.role });

            res.cookies.set('token', token, {
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            });
            return res;
        }
        return NextResponse.json({ error: 'Неверные данные' }, { status: 401 });
    } catch (e) {
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}