import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Flash = {
    success?: string;
    error?: string;
};

export default function FlashToast() {
    const { flash } = usePage().props as { flash?: Flash };

    const [open, setOpen] = useState(false);
    const [kind, setKind] = useState<'success' | 'error'>('success');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const nextSuccess = flash?.success;
        const nextError = flash?.error;

        if (nextSuccess) {
            setKind('success');
            setMessage(nextSuccess);
            setOpen(true);
            return;
        }

        if (nextError) {
            setKind('error');
            setMessage(nextError);
            setOpen(true);
        }
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        if (!open) return;
        const t = window.setTimeout(() => setOpen(false), 3500);
        return () => window.clearTimeout(t);
    }, [open]);

    if (!open || !message) return null;

    const base =
        'fixed top-5 right-5 z-[9999] w-[360px] max-w-[calc(100vw-24px)] ' +
        'rounded-xl border px-4 py-3 shadow-2xl backdrop-blur';

    const styles =
        kind === 'success'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
            : 'border-red-500/30 bg-red-500/10 text-red-100';

    return (
        <div className={`${base} ${styles}`} role="status" aria-live="polite">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 text-lg">
                    {kind === 'success' ? '✅' : '⚠️'}
                </div>

                <div className="flex-1">
                    <div className="text-sm font-semibold">
                        {kind === 'success' ? 'Success' : 'Error'}
                    </div>
                    <div className="mt-0.5 text-sm opacity-90">{message}</div>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="ml-2 rounded-md px-2 py-1 text-sm opacity-80 hover:opacity-100"
                    aria-label="Close toast"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
