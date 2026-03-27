export default function BookCard({ book, onClick }) {
    return (
        <div
            onClick={onClick}
            className="group border border-gray-100 p-4 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
        >
            <div className="relative mb-4 overflow-hidden rounded-xl h-48 bg-gray-50">
                {book.image_url ? (
                    <img src={book.image_url} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 italic">No Cover</div>
                )}
            </div>
            <h3 className="font-bold text-gray-900 truncate">{book.title}</h3>
            <p className="text-sm text-gray-500">{book.author}</p>
            <div className="mt-3 flex justify-between items-center">
                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">
                    {book.year}
                </span>
                <span className="text-xs text-gray-400">
                    {book.quantity} в наличии
                </span>
            </div>
        </div>
    );
}