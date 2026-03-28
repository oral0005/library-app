"use client"
import { useEffect, useState } from 'react';
import { BookOpenText, History as HistoryIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function UserHistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/history')
            .then(res => res.json())
            .then(data => {
                // Егер API қате қайтармаса, тарихты сақтаймыз
                if (Array.isArray(data)) {
                    setHistory(data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50/50">
            <div className="bg-white p-6 mb-12 space-y-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <HistoryIcon className="text-blue-500" /> Менің брондау тарихым
                    </h1>
                    <Link href="/" className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                        Кітапханаға қайту
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                        <BookOpenText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Сізде әлі брондалған кітаптар жоқ</h3>
                        <p className="mt-1 text-sm text-gray-500">Кітапханадан өзіңізге ұнайтын кітапты тауып, брондаңыз.</p>
                        <Link href="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                            Кітаптарды қарау
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 rounded-lg">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg font-medium">Бронь ID</th>
                                <th className="px-4 py-3 font-medium">Кітап атауы</th>
                                <th className="px-4 py-3 font-medium">Күні</th>
                                <th className="px-4 py-3 rounded-r-lg font-medium text-right">Күйі</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            <AnimatePresence>
                                {history.map((item, index) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50/80 transition-colors group"
                                    >
                                        <td className="px-4 py-4 font-mono text-gray-400">#{item.id}</td>
                                        <td className="px-4 py-4 font-semibold text-gray-900">{item.book_title}</td>
                                        <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                                            {new Date(item.booking_date).toLocaleDateString('ru-RU')}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-green-50 text-green-700">
                                                    Қабылданды
                                                </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}