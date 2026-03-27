"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            alert('Аккаунт создан! Теперь войдите.');
            router.push('/login');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 border p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Регистрация</h1>
            <form onSubmit={handleRegister} className="space-y-4">
                <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <Input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
                <Button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded">Создать аккаунт</Button>
            </form>
            <div className="mt-4 text-center text-sm">
                Уже есть аккаунт? <Link href="/login" className="text-blue-500 underline">Войти</Link>
            </div>
        </div>
    );
}