"use client"
import { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';
import BookModal from '@/components/BookModal';
import Input from '@/components/ui/Input'; // Предполагаю, что он у тебя есть

export default function Home() {
    const [books, setBooks] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Состояние для поиска

    const loadData = async (query = '') => {
        const [booksRes, userRes] = await Promise.all([
            fetch(`/api/books${query ? `?search=${encodeURIComponent(query)}` : ''}`),
            fetch('/api/auth/me')
        ]);
        const booksData = await booksRes.json();
        const userData = await userRes.json();
        setBooks(booksData);
        setUser(userData.user);
    };

    // Загрузка при первом рендере
    useEffect(() => { loadData(); }, []);

    // Эффект для "живого" поиска с небольшой задержкой (debouncing)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadData(searchTerm);
        }, 300); // Поиск сработает через 300мс после остановки набора

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleBooking = async (book) => {
        // ... твой существующий код handleBooking
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Библиотека</h1>

                {/* Поле поиска */}
                <div className="w-full max-w-md">
                    <Input
                        type="text"
                        placeholder="Поиск по книге или автору..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                    />
                </div>
            </div>

            {books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {books.map(book => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onClick={() => setSelectedBook(book)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    {searchTerm ? 'Ничего не найдено по вашему запросу' : 'Книг пока нет'}
                </div>
            )}

            {selectedBook && (
                <BookModal
                    book={selectedBook}
                    user={user}
                    onClose={() => setSelectedBook(null)}
                    onBook={handleBooking}
                />
            )}
        </div>
    );
}