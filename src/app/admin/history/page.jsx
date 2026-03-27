"use client"
import { useEffect, useState } from 'react';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetch('/api/admin/history')
            .then(res => res.json())
            .then(data => setHistory(data));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">История бронирований</h1>
            <table className="w-full border-collapse border">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Пользователь (Email)</th>
                    <th className="border p-2">Книга</th>
                    <th className="border p-2">Дата</th>
                    <th className="border p-2">Статус</th>
                </tr>
                </thead>
                <tbody>
                {history.map(item => (
                    <tr key={item.id} className="text-center">
                        <td className="border p-2">{item.id}</td>
                        <td className="border p-2">{item.user_email}</td>
                        <td className="border p-2">{item.book_title}</td>
                        <td className="border p-2">{new Date(item.booking_date).toLocaleString()}</td>
                        <td className="border p-2">{item.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}