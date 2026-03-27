"use client"
import Button from '@/components/ui/Button';

export default function BookModal({ book, user, onClose, onBook }) {
    if (!book) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
                {/* Кнопка закрытия */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
                >
                    &times;
                </button>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Обложка */}
                        <div className="w-full md:w-40 shrink-0">
                            {book.image_url ? (
                                <img
                                    src={book.image_url}
                                    alt={book.title}
                                    className="w-full h-56 object-cover rounded-lg shadow-md"
                                />
                            ) : (
                                <div className="w-full h-56 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                    Нет обложки
                                </div>
                            )}
                        </div>

                        {/* Инфо */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{book.title}</h2>
                            <p className="text-lg text-blue-600 font-medium mb-2">{book.author}</p>
                            <div className="inline-block bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 mb-4">
                                Год издания: {book.year || 'Не указан'}
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                {book.description || 'Описание отсутствует.'}
                            </p>

                            <p className="text-sm font-semibold">
                                Осталось: <span className={book.quantity > 0 ? "text-green-600" : "text-red-600"}>
                                    {book.quantity} шт.
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-6">
                        <Button
                            onClick={() => onBook(book)}
                            disabled={book.quantity < 1}
                            className={`w-full py-3 rounded-xl font-bold transition-all ${
                                book.quantity < 1
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-95"
                            }`}
                        >
                            {book.quantity < 1 ? "Нет в наличии" : "Забронировать книгу"}
                        </Button>
                        {!user && (
                            <p className="text-center text-xs text-red-500 mt-2">
                                Нужно войти в аккаунт, чтобы забронировать
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}