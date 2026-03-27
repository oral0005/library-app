"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function BookDetails({ params }) {
    const [book, setBook] = useState(null);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Получаем инфу о книге
        fetch(`/api/books/${params.id}`).then(res => res.json()).then(data => setBook(data));
        // Получаем текущего юзера для привязки брони
        fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user));
    }, [params.id]);

    const handleBooking = async () => {
        if (!user) {
            alert("Сначала авторизуйтесь!");
            router.push('/login');
            return;
        }

        if (book.quantity < 1) {
            alert("Книг больше нет в наличии");
            return;
        }

        // Создаем бронь
        await fetch('/api/bookings', {
            method: 'POST',
            body: JSON.stringify({ user_id: user.id, book_id: book.id }),
        });

        // Уменьшаем количество книг на 1
        await fetch(`/api/books/${book.id}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity: book.quantity - 1 }),
        });

        alert("Книга успешно забронирована!");
        router.push('/');
    };

    if (!book) return <p>Загрузка...</p>;

    return (
        <div className="max-w-xl mx-auto border p-6 rounded shadow mt-10">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{book.author}</p>
            <p className="mb-6">В наличии: <span className="font-bold">{book.quantity} шт.</span></p>

            <Button
                onClick={handleBooking}
                disabled={book.quantity < 1}
                className={`w-full py-3 rounded text-white ${book.quantity < 1 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
                {book.quantity < 1 ? 'Нет в наличии' : 'Забронировать книгу'}
            </Button>
        </div>
    );
}