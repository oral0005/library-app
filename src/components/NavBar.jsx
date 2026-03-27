"use client"
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Добавляем состояние загрузки
    const pathname = usePathname();
    const router = useRouter();

    // Список страниц, где Navbar НЕ должен отображаться
    const hideNavbarPaths = ['/login', '/register'];

    // Обернули в useCallback, чтобы функцию можно было безопасно вызывать в useEffect
    const checkAuth = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [pathname, checkAuth]); // Важно: следим за изменением пути (pathname)

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            // Используем router.push вместо window.location для SPA-перехода
            router.push('/login');
            router.refresh(); // Обновляем серверные компоненты
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        }
    };

    // 1. Скрываем Navbar на страницах логина/регистрации
    if (hideNavbarPaths.includes(pathname)) {
        return null;
    }

    return (
        <nav className="p-4 bg-gray-900 text-white flex justify-between items-center shadow-md">
            <Link
                href={user?.role === 'admin' ? '/admin' : '/'}
                className="font-bold text-xl hover:text-blue-400 transition-colors"
            >
                {user?.role === 'admin' ? '🛡️ Admin Panel' : '📚 Library'}
            </Link>

            <div className="flex items-center gap-6">
                {/* 2. Пока идет проверка (loading), можно скрыть кнопки, чтобы они не "прыгали" */}
                {!loading && (
                    <>
                        {user ? (
                            <div className="flex gap-4 items-center">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-400 uppercase font-bold">{user.role}</span>
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded text-sm transition-all"
                                >
                                    Выйти
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-sm transition-all">
                                Войти
                            </Link>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
}