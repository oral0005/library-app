"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }) {
    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8 flex gap-6 border-b border-gray-100 pb-px relative">
                <AdminTab href="/admin">Управление книгами</AdminTab>
                <AdminTab href="/admin/history">История бронирований</AdminTab>
            </div>
            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.main>
        </div>
    );
}

function AdminTab({ href, children }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`relative px-1 py-3 text-sm font-semibold transition-colors duration-200 ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            {children}
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </Link>
    );
}