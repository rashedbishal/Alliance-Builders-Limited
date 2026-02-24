import type { PropsWithChildren } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import FloatingMessageButton from '@/components/FloatingMessageButton';

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
