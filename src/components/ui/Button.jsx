import { LoaderCircle } from "lucide-react";

export default function Button({ text, loading = false, disabled, children, ...props }) {
    const content = text || children;

    return (
        <button
            className="w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-800 px-4 py-2 text-white transition-colors hover:border-gray-700 hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            disabled={disabled || loading}
            {...props}
        >
            {!loading ? (
                content
            ) : (
                <div className="flex justify-center">
                    <LoaderCircle className="animate-spin" color="#fff" size={24} />
                </div>
            )}
        </button>
    );
}