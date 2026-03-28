"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const data = await res.json();
            router.push(data.role === 'admin' ? '/admin' : '/');
            router.refresh();
        } else {
            setError('Электрондық пошта немесе құпия сөз қате');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center -mt-8">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm border border-gray-100">
                <h2 className="mb-8 text-center text-2xl font-semibold text-gray-800">Кітапханаға кіру</h2>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <Input
                        type="email"
                        label="Email"
                        name="email"
                        placeholder="Электрондық поштаңызды енгізіңіз"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        icon={<Mail size={20} />}
                        required
                    />
                    <Input
                        type="password"
                        label="Құпия сөз"
                        name="password"
                        placeholder="Құпия сөзіңізді енгізіңіз"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        icon={<Lock size={20} />}
                        required
                    />

                    <div className="mt-6">
                        <Button text="Кіру" loading={loading} type="submit" />
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <span className="text-sm text-gray-600">Тіркелмегенсіз бе? </span>
                    <Link href="/register" className="text-sm font-medium text-blue-600 hover:underline">
                        Тіркелу
                    </Link>
                </div>
            </div>
        </div>
    );
}