const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const books = [
    {
        title: 'Абай жолы. III том',
        author: 'Мұхтар Әуезов',
        description: 'Әйгілі "Абай жолы" роман-эпопеясының үшінші томында Абайдың кемелдік шағы, халық мүддесі жолындағы күресі мен ағартушылық қызметі суреттеледі.',
        year: 1952,
        image_url: '/uploads/abay.png'
    },
    {
        title: 'Әке туралы ой-толғау',
        author: 'Қасым-Жомарт Тоқаев',
        description: 'Бұл кітапта автор өзінің әкесі — белгілі жазушы Кемел Тоқаевтың өмірі мен шығармашылығы, оның адами қасиеттері мен тәлім-тәрбиесі туралы сыр шертеді.',
        year: 2005,
        image_url: '/uploads/ake_turaly.jpg'
    },
    {
        title: 'Азаткерлер жолы',
        author: 'Серік Ерғали',
        description: 'Тарихи деректерге негізделген бұл еңбекте қазақ халқының азаттық жолындағы күресі мен ұлттық мүддені қорғаған тұлғалардың тағдыры баяндалады.',
        year: 2018,
        image_url: '/uploads/azatker.jpg'
    },
    {
        title: 'Бескорыстие',
        author: 'Константин Георгиевич Паустовский',
        description: 'Рассказ классика русской литературы о красоте родной природы, о душевной чистоте и о том, как важно сохранять в себе человечность и бескорыстное отношение к миру.',
        year: 1947,
        image_url: '/uploads/beskoristie.png'
    },
    {
        title: 'Жусан',
        author: 'Қалижан Бекхожин',
        description: 'Белгілі ақынның бұл шығармасында туған жерге деген сағыныш, Отан сүйгіштік және дала өмірінің тыныс-тіршілігі поэтикалық тілмен өрнектелген.',
        year: 1970,
        image_url: '/uploads/jusan.jpg'
    },
    {
        title: 'Денсаулықтың сегіз құпиясы: Заманауи номадтың жан сыры',
        author: 'Алмаз Шарман',
        description: 'Профессор Алмаз Шарманның бұл кітабында ұзақ әрі сапалы өмір сүрудің заманауи медициналық тәсілдері мен ежелгі көшпенділер мәдениетінің үйлесімі туралы айтылады.',
        year: 2021,
        image_url: '/uploads/densaulyk.png'
    }
];

async function seedBooks() {
    try {
        console.log('--- Начинаю загрузку книг... ---');

        for (const book of books) {
            // Генерируем случайное количество от 5 до 50
            const randomQuantity = Math.floor(Math.random() * 46) + 5;

            const query = `
                INSERT INTO books (title, author, description, year, quantity, image_url)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id;
            `;
            const values = [
                book.title,
                book.author,
                book.description,
                book.year,
                randomQuantity,
                book.image_url
            ];

            const res = await pool.query(query, values);
            console.log(`✅ Добавлена книга: "${book.title}" (ID: ${res.rows[0].id}, Кол-во: ${randomQuantity})`);
        }

        console.log('--- Все книги успешно добавлены! ---');
    } catch (err) {
        console.error('❌ Ошибка при заполнении данными:', err.message);
    } finally {
        await pool.end();
    }
}

seedBooks();