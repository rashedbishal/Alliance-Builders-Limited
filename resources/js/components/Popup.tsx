import * as Dialog from '@radix-ui/react-dialog';
import { X, MapPin, Bed, Bath, Ruler, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

interface PopupProps {
    showOnLoad?: boolean;
}

interface PropertyData {
    title: string;
    image: string;
    hyperlink: string;
}

const POPUP_STORAGE_KEY = 'popup_shown_session';

// Hardcoded featured property data (can be replaced with backend data)
const FEATURED_PROPERTY: PropertyData = {
    title: "Big House",
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    hyperlink: 'https://hyperlink.io/',
};

export default function Popup({ showOnLoad = true }: PopupProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (showOnLoad) {
            // TODO: The following line is only for testing. Remove it before production.
            sessionStorage.removeItem(POPUP_STORAGE_KEY); // temporary: remove for production
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
                <Dialog.Content className="fixed top-1/2 right-1/2 z-50 w-72 sm:w-80 translate-x-1/2 -translate-y-1/2 overflow-hidden border-4 border-accent-foreground bg-white shadow-2xl md:top-26 md:right-4.5 md:w-96 md:translate-x-0 md:translate-y-0 lg:w-md">
                    {/* Close Button */}
                    <Dialog.Close asChild>
                        <button className="group absolute top-4 right-4 z-10 rounded-full bg-white/80 p-2 transition-all hover:bg-white cursor-pointer">
                            <X className="h-5 w-5 text-gray-700 transition-colors group-hover:text-gray-900" />
                        </button>
                    </Dialog.Close>

                    {/* Image Section */}
                    <div className="relative h-72 overflow-hidden rounded-2xl bg-gray-200">
                        <Link href={FEATURED_PROPERTY.hyperlink}>
                            <img
                                src={FEATURED_PROPERTY.image}
                                alt={FEATURED_PROPERTY.title}
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </Link>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
