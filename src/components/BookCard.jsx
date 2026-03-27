export default function BookCard({ book }) {
    return (
        <div className="border p-4 rounded shadow">
            <h2 className="font-bold">{book.title}</h2>
            <p>{book.author}</p>
        </div>
    );
}