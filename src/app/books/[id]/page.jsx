import Button from '@/components/ui/Button';

export default function BookDetails({ params }) {
    return (
        <div>
            <h1 className="text-3xl font-bold">Book ID: {params.id}</h1>
            <Button className="mt-4">Забронировать</Button>
        </div>
    );
}