export default function BookCard({ book, onClick }) {
    return (
        <div
            onClick={onClick}
            className="group flex gap-2 border border-gray-100 p-4 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 items-center"
        >
            {/* Левая часть: Фото обложки */}
            <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50 shadow-inner">
                {book.image_url ? (
                    <img
                        src={book.image_url}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[10px] font-bold text-gray-400 uppercase text-center p-1 leading-tight">
                        Мұқаба жоқ
                    </div>
                )}
            </div>

            {/* Правая часть: Вся информация */}
            <div className="flex flex-1 flex-col self-stretch justify-between py-1">
                <div>
                    <h3 className="line-clamp-2 font-bold text-gray-900 transition-colors group-hover:text-blue-600 text-md">
                        {book.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mb-1">{book.author}</p>
                    <span className="inline-block text-xs text-gray-400 py-0.5 ">
                        Год издания: {book.year || 'Не указан'}
                    </span>
                </div>

                {/* Количество справа снизу */}
                <div className="flex justify-end mt-2">
                    <div className={`px-3 py-1 text-xs font-bold ${
                        book.quantity > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                    }`}>
                        {book.quantity > 0 ? ` в наличии` : 'Нет в наличии'}
                    </div>
                </div>
            </div>
        </div>
    );
}