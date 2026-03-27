"use client"
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Book, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    const hideNavbarPaths = ['/login', '/register'];

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
    }, [pathname, checkAuth]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        }
    };

    if (hideNavbarPaths.includes(pathname)) {
        return null;
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Логотип */}
                    <div className="flex items-center">
                        <Link
                            href={user?.role === 'admin' ? '/admin' : '/'}
                            className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 transition-all hover:opacity-80"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-blue-200 shadow-lg">
                                {user?.role === 'admin' ? <ShieldCheck size={20} /> : <Book size={20} />}
                            </div>
                            <span>
                                {user?.role === 'admin' ? 'Admin' : 'Library'}
                                <span className="text-blue-600">.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Правая часть */}
                    <div className="flex items-center gap-4">
                        {!loading && (
                            <>
                                {user ? (
                                    <div className="flex items-center gap-5">
                                        <div className="hidden flex-col items-end sm:flex">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                                {user.role}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700">{user.email}</span>
                                        </div>

                                        <div className="h-8 w-px bg-gray-100" />

                                        <button
                                            onClick={handleLogout}
                                            className="group flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
                                        >
                                            <LogOut size={18} className="transition-transform group-hover:-translate-x-0.5" />
                                            <span className="hidden sm:inline">Выйти</span>
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-gray-200 transition-all hover:bg-gray-800 active:scale-95"
                                    >
                                        Войти
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}