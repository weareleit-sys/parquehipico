import React from 'react';
import Hero from '../../components/Hero/Hero';
import Servicios from '../../components/Servicios/Servicios';
import Galeria from '../../components/Galeria/Galeria';
import Calendario from '../../components/Calendario/Calendario';
import FichaTecnica from '../../components/Arrienda/FichaTecnica';
import ParallaxLogo from '../../components/UI/ParallaxLogo';

export default function InicioPage() {
    return (
        <main className="flex min-h-screen flex-col bg-white relative">
            {/* Logo con efecto parallax */}
            <ParallaxLogo />

            {/* SECCIONES */}
            <Hero />
            <Galeria />
            <Calendario />
            <FichaTecnica />
            <Servicios />
        </main>
    );
}

