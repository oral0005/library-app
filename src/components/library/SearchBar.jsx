import { Search, X, Loader2 } from 'lucide-react';

export default function SearchBar({ searchTerm, setSearchTerm, isLoading }) {
    return (
        <div className="relative w-full max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 transition-colors ${searchTerm ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            <input
                type="text"
                placeholder="Кітап аты немесе авторы"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 bg-white border-none rounded-2xl shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 text-gray-700 placeholder:text-gray-400"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                ) : searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                )}
            </div>
        </div>
    );
}