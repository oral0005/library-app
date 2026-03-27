"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock, Mail } from 'lucide-react';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            alert('Аккаунт создан! Теперь войдите.');
            router.push('/login');
        } else {
            alert('Произошла ошибка при регистрации');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 -mt-8">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm border border-gray-100">
                <h2 className="mb-8 text-center text-2xl font-semibold text-gray-800">Регистрация</h2>

                <form onSubmit={handleRegister}>
                    <Input
                        type="email"
                        label="Email"
                        name="email"
                        placeholder="Введите ваш email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        icon={<Mail size={20} />}
                        required
                    />
                    <Input
                        type="password"
                        label="Пароль"
                        name="password"
                        placeholder="Придумайте пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        icon={<Lock size={20} />}
                        required
                    />

                    <div className="mt-6">
                        <Button text="Создать аккаунт" loading={loading} type="submit" />
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <span className="text-sm text-gray-600">Уже есть аккаунт? </span>
                    <Link href="/login" className="text-sm font-medium text-blue-600 hover:underline">
                        Войти
                    </Link>
                </div>
            </div>
        </div>
    );
}