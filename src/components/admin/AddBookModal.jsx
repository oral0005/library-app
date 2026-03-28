import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Image as ImageIcon, AlignLeft, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AddBookModal({ isOpen, onClose, onSuccess, book }) {
    const [formData, setFormData] = useState({ title: '', author: '', description: '', year: '', quantity: 1 });
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Заполнение формы, если передана книга
    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || '',
                author: book.author || '',
                description: book.description || '',
                year: book.year || '',
                quantity: book.quantity || 1
            });
            setImagePreview(book.image_url || null);
        } else {
            setFormData({ title: '', author: '', description: '', year: '', quantity: 1 });
            setImagePreview(null);
        }
        setFile(null);
    }, [book, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('description', formData.description);
        data.append('year', formData.year);
        data.append('quantity', formData.quantity);
        if (file) data.append('image', file);

        // Определяем, создавать новую или редактировать старую
        const url = book ? `/api/books/${book.id}` : '/api/books';
        const method = book ? 'PUT' : 'POST';

        const res = await fetch(url, { method, body: data });

        if (res.ok) {
            onSuccess();
        } else {
            alert("Ошибка при сохранении книги");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={24} />
                </button>
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg"><Plus className="text-blue-600"/></div>
                        {book ? 'Редактировать книгу' : 'Новая книга'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Название</label>
                                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Напр: Мастер и Маргарита" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Автор</label>
                                <Input value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="М. Булгаков" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Calendar size={14}/> Год издания</label>
                                <Input type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} placeholder="2024" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Количество</label>
                                <Input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} min="1" required />
                            </div>
                        </div>
                        {/* Загрузка фото */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><ImageIcon size={14}/> Обложка книги</label>
                            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors bg-gray-50/50 min-h-[120px] flex flex-col items-center justify-center">
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                                       onChange={e => {
                                           const selectedFile = e.target.files[0];
                                           setFile(selectedFile);
                                           if (selectedFile) {
                                               const reader = new FileReader();
                                               reader.onloadend = () => setImagePreview(reader.result);
                                               reader.readAsDataURL(selectedFile);
                                           } else setImagePreview(book?.image_url || null); // Возврат старой картинки при отмене
                                       }}
                                />
                                {imagePreview ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <img src={imagePreview} alt="Превью" className="h-32 w-auto object-cover rounded-lg shadow-sm" />
                                        <span className="text-sm text-gray-500 truncate px-2">{file?.name || 'Текущая обложка'}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <div className="bg-white p-2 rounded-lg shadow-sm"><ImageIcon className="text-blue-500" size={20}/></div>
                                        <span className="text-sm">Нажмите или перетащите файл</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><AlignLeft size={14}/> Описание</label>
                            <textarea className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Краткое содержание..." />
                        </div>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg w-full py-3 rounded-xl font-bold">
                            {book ? 'Сохранить изменения' : 'Добавить в коллекцию'}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}