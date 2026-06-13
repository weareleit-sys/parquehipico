'use client';

import { usePathname } from 'next/navigation';
import Navbar from "./components/Header/Navbar";
import Footer from "./components/Footer/Footer";
import FloatingWhatsApp from "./components/UI/FloatingWhatsApp";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isInternalRoute =
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/login');

    if (isInternalRoute) {
        // Admin routes: sin Navbar, Footer, ni WhatsApp
        return <>{children}</>;
    }

    // Rutas públicas: con todos los elementos
    return (
        <>
            <Navbar />
            {children}
            <Footer />
            <FloatingWhatsApp />
        </>
    );
}
