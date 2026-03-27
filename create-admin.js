const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function createAdmin() {
    const email = 'admin@gmail.com';
    const password = 'admin123';
    const role = 'admin';

    try {
        const hash = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
            [email, hash, role]
        );
        console.log('✅ Админ успешно создан!');
    } catch (err) {
        console.error('❌ Ошибка:', err.message);
    } finally {
        await pool.end();
    }
}

createAdmin();