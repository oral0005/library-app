import Button from './ui/Button';
import Input from './ui/Input';

export default function AdminForm() {
    return (
        <form className="space-y-4">
            <Input placeholder="Book Title" />
            <Input placeholder="Author" />
            <Button>Add Book</Button>
        </form>
    );
}