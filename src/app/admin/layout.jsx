import Link from 'next/link';

export default function AdminLayout({ children }) {
    return (
        <div>
            <div className="mb-6 flex gap-4 border-b pb-4">
                <Link href="/admin" className="text-blue-600 font-bold hover:underline">Управление книгами</Link>
                <Link href="/admin/history" className="text-blue-600 font-bold hover:underline">История бронирований</Link>
            </div>
            {children}
        </div>
    );
}