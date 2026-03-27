"use client"
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminDashboard() {
    const [books, setBooks] = useState([]);
    const [formData, setFormData] = useState({
        title: '', author: '', description: '', year: '', quantity: 1, image_url: ''
    });
    const [uploading, setUploading] = useState(false);

    const fetchBooks = async () => {
        const res = await fetch('/api/books');
        const data = await res.json();
        setBooks(data);
    };

    useEffect(() => { fetchBooks(); }, []);

    // Загрузка фото
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: data });
            const result = await res.json();
            setFormData({ ...formData, image_url: result.url });
        } catch (e) {
            alert('Ошибка загрузки фото');
        } finally {
            setUploading(false);
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/books', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            setFormData({ title: '', author: '', description: '', year: '', quantity: 1, image_url: '' });
            fetchBooks();
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Удалить книгу?')) return;
        const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
        if (res.ok) fetchBooks();
    };

    const handleUpdateQuantity = async (id, currentQty, amount) => {
        const newQty = currentQty + amount;
        if (newQty < 0) return;
        const res = await fetch(`/api/books/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity: newQty }),
        });
        if (res.ok) fetchBooks();
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Панель управления</h1>

            <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 bg-gray-50 p-6 rounded-lg border">
                <Input placeholder="Название" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                <Input placeholder="Автор" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
                <Input type="number" placeholder="Год издания" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                <Input type="number" placeholder="Количество" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                <textarea
                    className="md:col-span-2 p-2 border rounded"
                    placeholder="Описание книги"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
                <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Обложка книги</label>
                    <input type="file" onChange={handleFileChange} className="mb-2" />
                    {formData.image_url && <p className="text-green-600 text-xs">Фото загружено: {formData.image_url}</p>}
                </div>
                <Button type="submit" disabled={uploading} className="md:col-span-2 bg-blue-600 text-white">
                    {uploading ? 'Загрузка фото...' : 'Добавить книгу в базу'}
                </Button>
            </form>

            <h2 className="text-xl font-bold mb-4">Текущий инвентарь</h2>
            <div className="space-y-4">
                {books.map(book => (
                    <div key={book.id} className="border p-4 rounded flex justify-between items-center bg-white shadow-sm">
                        <div className="flex items-center gap-4">
                            {book.image_url && <img src={book.image_url} alt="" className="w-12 h-16 object-cover rounded" />}
                            <div>
                                <p className="font-bold">{book.title} ({book.year})</p>
                                <p className="text-sm text-gray-600">{book.author}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-gray-100 rounded">
                                <button onClick={() => handleUpdateQuantity(book.id, book.quantity, -1)} className="px-3 py-1 hover:bg-gray-200">-</button>
                                <span className="px-3 font-mono">{book.quantity}</span>
                                <button onClick={() => handleUpdateQuantity(book.id, book.quantity, 1)} className="px-3 py-1 hover:bg-gray-200">+</button>
                            </div>
                            <button onClick={() => handleDelete(book.id)} className="text-red-500 hover:text-red-700 font-medium">Удалить</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}