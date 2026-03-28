import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function AdminBookCard({ book, onUpdateQuantity, onDelete, onEdit }) {
    return (
        <motion.div
            layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => onEdit(book)}
            className="border border-gray-100 p-5 rounded-2xl bg-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
        >
            <div className="flex items-center gap-5 flex-1 w-full">
                <div className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                    {book.image_url ? (
                        <img src={book.image_url} className="w-full h-full object-cover" alt="" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[10px] font-bold text-gray-400 uppercase text-center p-1">МҰҚАБА ЖОҚ</div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{book.title}</p>
                    <p className="text-sm text-gray-600 font-medium">{book.author}</p>
                    <p className="text-xs text-gray-400 mt-1">Шыққан жылы: {book.year || 'Белгісіз'}</p>
                </div>
            </div>

            <div className="flex items-center gap-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button onClick={() => onUpdateQuantity(book.id, book.quantity, -1)} className="w-8 h-8 rounded-lg bg-white shadow-sm hover:bg-gray-100">-</button>
                    <span className="w-8 text-center font-bold text-gray-700">{book.quantity}</span>
                    <button onClick={() => onUpdateQuantity(book.id, book.quantity, 1)} className="w-8 h-8 rounded-lg bg-white shadow-sm hover:bg-gray-100">+</button>
                </div>
                <button onClick={() => onDelete(book.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 size={20} />
                </button>
            </div>
        </motion.div>
    );
}