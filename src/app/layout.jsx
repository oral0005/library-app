import Navbar from '@/components/NavBar';
import './globals.css';

export default function RootLayout({ children }) {
    return (
        <html lang="ru">
        <body>
        <Navbar />
        <main className="p-8">{children}</main>
        </body>
        </html>
    );
}