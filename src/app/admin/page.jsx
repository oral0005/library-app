"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Image as ImageIcon, AlignLeft, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminDashboard() {
    const [books, setBooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null); // Состояние для файла
    const [formData, setFormData] = useState({
        title: '', author: '', description: '', year: '', quantity: 1
    });

    const fetchBooks = async () => {
        const res = await fetch('/api/books');
        const data = await res.json();
        setBooks(data);
    };

    useEffect(() => { fetchBooks(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Удалить книгу?')) return;
        const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setBooks(books.filter(b => b.id !== id));
        } else {
            alert("Ошибка при удалении");
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Создаем FormData для отправки файлов и текста
        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('description', formData.description);
        data.append('year', formData.year);
        data.append('quantity', formData.quantity);
        if (file) {
            data.append('image', file);
        }

        const res = await fetch('/api/books', {
            method: 'POST',
            body: data, // Браузер сам установит нужный Content-Type
        });

        if (res.ok) {
            fetchBooks();
            setIsModalOpen(false);
            setFormData({ title: '', author: '', description: '', year: '', quantity: 1 });
            setFile(null);
        } else {
            alert("Ошибка при сохранении книги");
        }
    };

    return (
        <div className="relative pb-20">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Инвентарь</h1>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {books.map(book => (
                        <motion.div
                            key={book.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="border border-gray-100 p-5 rounded-2xl bg-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-5 flex-1 w-full">
                                <div className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                    {book.image_url ? (
                                        <img src={book.image_url} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-[10px] text-gray-300 uppercase">No Cover</div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 truncate">{book.title}</p>
                                    <p className="text-sm text-blue-600 font-medium">{book.author}</p>
                                    <p className="text-xs text-gray-400 mt-1">{book.year} г.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
                                    <button onClick={() => handleUpdateQuantity(book.id, book.quantity, -1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-100">-</button>
                                    <span className="w-8 text-center font-bold text-gray-700">{book.quantity}</span>
                                    <button onClick={() => handleUpdateQuantity(book.id, book.quantity, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-100">+</button>
                                </div>
                                <button onClick={() => handleDelete(book.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-200 flex items-center justify-center z-40"
            >
                <Plus size={32} />
            </motion.button>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>

                            <div className="p-8">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg"><Plus className="text-blue-600"/></div>
                                    Новая книга
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Название</label>
                                            <Input
                                                value={formData.title}
                                                onChange={e => setFormData({...formData, title: e.target.value})}
                                                placeholder="Напр: Мастер и Маргарита"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Автор</label>
                                            <Input
                                                value={formData.author}
                                                onChange={e => setFormData({...formData, author: e.target.value})}
                                                placeholder="М. Булгаков"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Calendar size={14}/> Год издания
                                            </label>
                                            <Input
                                                type="number"
                                                value={formData.year}
                                                onChange={e => setFormData({...formData, year: e.target.value})}
                                                placeholder="2024"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Количество</label>
                                            <Input
                                                type="number"
                                                value={formData.quantity}
                                                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* ЗАГРУЗКА ФАЙЛА */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <ImageIcon size={14}/> Обложка книги
                                        </label>
                                        <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors bg-gray-50/50">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => setFile(e.target.files[0])}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <div className="flex items-center gap-3 text-gray-500">
                                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                                    <ImageIcon className="text-blue-500" size={20}/>
                                                </div>
                                                <span className="text-sm truncate">
                                                    {file ? file.name : "Нажмите или перетащите файл для загрузки"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <AlignLeft size={14}/> Описание
                                        </label>
                                        <textarea
                                            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] transition-all"
                                            value={formData.description}
                                            onChange={e => setFormData({...formData, description: e.target.value})}
                                            placeholder="Краткое содержание книги..."
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-95 w-full py-3 rounded-xl font-bold transition-all">
                                            Добавить в коллекцию
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}