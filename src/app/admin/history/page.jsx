"use client"
import { useEffect, useState } from 'react';
import { Mail, BookOpenText, CalendarDays, History as HistoryIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetch('/api/admin/history')
            .then(res => res.json())
            .then(data => setHistory(data));
    }, []);

    return (
        <div className="bg-white p-6 mb-12 space-y-6 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tigh flex items-center gap-3">
                <HistoryIcon className="text-blue-500"/>Брондау тарихы
            </h1>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 rounded-lg">
                    <tr>
                        <th className="px-4 py-3 rounded-l-lg font-medium">ID</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Кітап</th>
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
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2.5 font-medium text-gray-800">
                                        <Mail size={16} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                                        {item.user_email}
                                    </div>
                                </td>
                                <td className="px-4 py-4 font-semibold text-gray-900">{item.book_title}</td>
                                <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                                    {new Date(item.booking_date).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="px-4 py-4 text-right">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-green-50 text-green-700`}>
                                            Қабылданды
                                        </span>
                                </td>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
}