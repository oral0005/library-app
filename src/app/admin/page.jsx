"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import AdminBookCard from '@/components/admin/AdminBookCard';
import AddBookModal from '@/components/admin/AddBookModal';

export default function AdminDashboard() {
    const [books, setBooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null); // Новое состояние

    const fetchBooks = async () => {
        const res = await fetch('/api/books');
        setBooks(await res.json());
    };

    useEffect(() => { fetchBooks(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Удалить книгу?')) return;
        const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
        if (res.ok) setBooks(books.filter(b => b.id !== id));
    };

    const handleUpdateQuantity = async (id, currentQty, amount) => {
        const newQty = Math.max(0, currentQty + amount);
        setBooks(books.map(b => b.id === id ? { ...b, quantity: newQty } : b));
        await fetch(`/api/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQty }),
        });
    };

    // Функции открытия модалки
    const openAddModal = () => {
        setEditingBook(null);
        setIsModalOpen(true);
    };

    const openEditModal = (book) => {
        setEditingBook(book);
        setIsModalOpen(true);
    };

    return (
        <div className="mb-12 space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Инвентарь</h1>
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {books.map(book => (
                        <AdminBookCard
                            key={book.id}
                            book={book}
                            onUpdateQuantity={handleUpdateQuantity}
                            onDelete={handleDelete}
                            onEdit={openEditModal} // Передаем функцию редактирования
                        />
                    ))}
                </AnimatePresence>
            </div>

            <motion.button
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                onClick={openAddModal}
                className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center z-40"
            >
                <Plus size={32} />
            </motion.button>

            <AnimatePresence>
                {isModalOpen && (
                    <AddBookModal
                        isOpen={isModalOpen}
                        book={editingBook} // Передаем книгу (или null)
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingBook(null);
                        }}
                        onSuccess={() => {
                            setIsModalOpen(false);
                            setEditingBook(null);
                            fetchBooks();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}