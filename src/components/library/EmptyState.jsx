import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function EmptyState({ searchTerm }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Search className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">
                {searchTerm ? 'Ничего не нашли' : 'Библиотека пуста'}
            </h3>
            <p className="text-gray-500 max-w-xs mt-2">
                {searchTerm ? `По запросу "${searchTerm}" совпадений нет.` : 'Книги появятся здесь совсем скоро.'}
            </p>
        </motion.div>
    );
}