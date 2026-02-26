import type { PropsWithChildren } from 'react';
import FloatingMessageButton from '@/components/FloatingMessageButton';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Popup from '@/components/Popup';

export default function AppLayout({ children }: PropsWithChildren) {
    // TODO: Replace this with a value from backend/props
    const showPopupOnLoad = true;

    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <FloatingMessageButton />
            <Popup showOnLoad={showPopupOnLoad} />
        </>
    );
}
