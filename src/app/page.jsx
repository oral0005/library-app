"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BookCard from '@/components/library/BookCard';
import BookModal from '@/components/library/BookModal';
import SearchBar from '@/components/library/SearchBar';
import EmptyState from '@/components/library/EmptyState';

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
            setBooks(await booksRes.json());
            const userData = await userRes.json();
            setUser(userData.user);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => loadData(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleBooking = async (book) => {
        if (!user) return alert("Жүйеге кіріңіз немесе тіркеліңіз");
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.id, book_id: book.id }),
        });
        if (res.ok) {
            alert("Кітап брондалды!");
            setSelectedBook(null);
            loadData(searchTerm);
        } else {
            alert((await res.json()).error || "Брондау кезінде қате кетті");
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50/50">
            <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Кітапхана</h1>
                    <p className="text-gray-500 mt-1">Келесі кітабыңызды табыңыз</p>
                </div>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} isLoading={isLoading} />
            </header>

            <AnimatePresence mode="wait">
                {books.length > 0 ? (
                    <motion.div key="grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {books.map((book, i) => (
                            <motion.div key={book.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <BookCard book={book} onClick={() => setSelectedBook(book)} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <EmptyState searchTerm={searchTerm} key="empty" />
                )}
            </AnimatePresence>

            <BookModal book={selectedBook} user={user} onClose={() => setSelectedBook(null)} onBook={handleBooking} />
        </div>
    );
}