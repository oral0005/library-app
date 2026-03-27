import { NextResponse } from 'next/server';
import fs from 'fs/promises';

export async function POST(req) {
    const data = await req.formData();
    const file = data.get('file');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(`./public/uploads/${file.name}`, buffer);
    return NextResponse.json({ url: `/uploads/${file.name}` });
}