import type { PropsWithChildren } from 'react';
import FloatingMessageButton from '@/components/FloatingMessageButton';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function AppLayout({ children }: PropsWithChildren) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <FloatingMessageButton />
        </>
    );
}
