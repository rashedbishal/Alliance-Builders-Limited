import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import ChatWidget from '@/components/ChatWidget';
import FloatingMessageButton from '@/components/FloatingMessageButton';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Popup } from '@/components/Popup';

export default function AppLayout({ children }: PropsWithChildren) {
    // TODO: Replace this with a value from backend/props
    const { isPopupEnabled } = usePage().props as { isPopupEnabled?: boolean };
    console.log('pop up status:', isPopupEnabled);
    // const showPopupOnLoad = isPopupEnabled;

    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <FloatingMessageButton />
            <Popup showOnLoad={isPopupEnabled} />

            <ChatWidget />
        </>
    );
}
