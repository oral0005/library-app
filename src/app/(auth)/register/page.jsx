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
            alert('Аккаунт жасалды! Енді жүйеге кіріңіз.');
            router.push('/login');
        } else {
            alert('Тіркелу кезінде қате кетті');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center  -mt-8">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm border border-gray-100">
                <h2 className="mb-8 text-center text-2xl font-semibold text-gray-800">Тіркелу</h2>

                <form onSubmit={handleRegister}>
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
                        placeholder="Құпия сөз ойлап табыңыз"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        icon={<Lock size={20} />}
                        required
                    />

                    <div className="mt-6">
                        <Button text="Тіркелу" loading={loading} type="submit" />
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <span className="text-sm text-gray-600">Аккаунтыңыз бар ма? </span>
                    <Link href="/login" className="text-sm font-medium text-blue-600 hover:underline">
                        Кіру
                    </Link>
                </div>
            </div>
        </div>
    );
}