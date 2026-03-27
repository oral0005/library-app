import Navbar from '@/components/NavBar';
import './globals.css'; // Не забудь создать или использовать дефолтный Tailwind CSS файл

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