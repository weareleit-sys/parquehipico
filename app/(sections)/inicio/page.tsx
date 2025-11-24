import React from 'react';
// Importa el Navbar
import Navbar from '../../components/Header/Navbar'; // ✅ NUEVO
import Hero from '../../components/Hero/Hero';
import Servicios from '../../components/Servicios/Servicios';
import Galeria from '../../components/Galeria/Galeria';
import Calendario from '../../components/Calendario/Calendario';
import FichaTecnica from '../../components/Arrienda/FichaTecnica';
import FloatingWhatsApp from '../../components/UI/FloatingWhatsApp';
import Footer from '../../components/Footer/Footer';

export default function InicioPage() {
    return (
        <main className="flex min-h-screen flex-col bg-white relative">
            {/* NAVBAR FLOTANTE */}
            <Navbar />

            {/* SECCIONES */}
            <Hero />
            <Servicios />
            <Galeria />
            <Calendario />
            <FichaTecnica />
            <FloatingWhatsApp />
            <Footer />
        </main>
    );
}
