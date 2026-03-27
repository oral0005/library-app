"use client"
import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react'; // Установи: npm install lucide-react
import { motion, AnimatePresence } from 'framer-motion'; // Установи: npm install framer-motion
import BookCard from '@/components/BookCard';
import BookModal from '@/components/BookModal';

export default function Home() {
    const [books, setBooks] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async (query = '') => {
        setIsLoading(true);
        try {
            const [booksRes, userRes] = await Promise.all([
                fetch(`/api/books${query ? `?search=${encodeURIComponent(query)}` : ''}`),
                fetch('/api/auth/me')
            ]);
            const booksData = await booksRes.json();
            const userData = await userRes.json();
            setBooks(booksData);
            setUser(userData.user);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadData(searchTerm);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleBooking = async (book) => {
        if (!user) {
            alert("Пожалуйста, войдите в систему, чтобы забронировать книгу");
            return;
        }

        try {
            const res = await fetch('/api/bookings', { // Убедитесь, что путь совпадает с вашим route.js для бронирований
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    book_id: book.id
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Книга успешно забронирована!");
                setSelectedBook(null); // Закрываем модальное окно
                loadData(searchTerm);   // Обновляем список книг, чтобы актуализировать количество (quantity)
            } else {
                alert(data.error || "Ошибка при бронировании");
            }
        } catch (err) {
            console.error("Booking error:", err);
            alert("Произошла ошибка при отправке запроса");
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50/50">
            {/* Секция хедера с красивым поиском */}
            <header className="mb-12 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Библиотека</h1>
                        <p className="text-gray-500 mt-1">Найдите свою следующую историю</p>
                    </div>

                    <div className="relative w-full max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className={`h-5 w-5 transition-colors ${searchTerm ? 'text-blue-500' : 'text-gray-400'}`} />
                        </div>

                        <input
                            type="text"
                            placeholder="Название, автор или жанр..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-12 py-3.5 bg-white border-none rounded-2xl shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 text-gray-700 placeholder:text-gray-400"
                        />

                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                            ) : searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Сетка книг с анимацией */}
            <AnimatePresence mode="wait">
                {books.length > 0 ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                    >
                        {books.map((book, index) => (
                            <motion.div
                                key={book.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <BookCard
                                    book={book}
                                    onClick={() => setSelectedBook(book)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                            <Search className="h-12 w-12 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">
                            {searchTerm ? 'Ничего не нашли' : 'Библиотека пуста'}
                        </h3>
                        <p className="text-gray-500 max-w-xs mt-2">
                            {searchTerm
                                ? `По запросу "${searchTerm}" совпадений нет. Попробуйте изменить фильтры.`
                                : 'Книги появятся здесь совсем скоро.'}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

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