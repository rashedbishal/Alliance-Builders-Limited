import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';

interface PopupProps {
    showOnLoad?: boolean;
}

const POPUP_STORAGE_KEY = 'popup_shown_session';

export default function Popup({ showOnLoad = true }: PopupProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (showOnLoad) {
            // Check if popup has already been shown in this session
            const hasShown = sessionStorage.getItem(POPUP_STORAGE_KEY);
            if (!hasShown) {
                setOpen(true);
                sessionStorage.setItem(POPUP_STORAGE_KEY, 'true');
            }
        }
    }, [showOnLoad]);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow z-50">
                    <Dialog.Title>Welcome!</Dialog.Title>
                    <Dialog.Description>Some message here.</Dialog.Description>
                    <Dialog.Close asChild>
                        <button>Close</button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
