import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function Register() {
    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-xl mb-4">Register</h1>
            <Input type="email" placeholder="Email" className="mb-2" />
            <Input type="password" placeholder="Password" className="mb-4" />
            <Button>Sign Up</Button>
        </div>
    );
}