import SearchBar from '@/components/SearchBar';
export default function Home() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Catalog</h1>
            <SearchBar />
            {/* Здесь будет map по книгам */}
        </div>
    );
}