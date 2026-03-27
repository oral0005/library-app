import Link from 'next/link';
export default function Navbar() {
    return (
        <nav className="p-4 bg-gray-800 text-white flex justify-between">
            <Link href="/">Library</Link>
            <div>
                <Link href="/login" className="mr-4">Login</Link>
                <Link href="/admin">Admin</Link>
            </div>
        </nav>
    );
}