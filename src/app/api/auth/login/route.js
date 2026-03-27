import db from '@/lib/db';
import bcrypt from 'bcrypt';
import { signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { email, password } = await req.json();
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (user && await bcrypt.compare(password, user.password_hash)) {
        const token = signToken({ id: user.id, role: user.role });
        const res = NextResponse.json({ message: 'Logged in' });
        res.cookies.set('token', token, { httpOnly: true });
        return res;
    }
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}