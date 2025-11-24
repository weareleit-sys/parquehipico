"use client"; // 👈 Vital: Permite interactividad (Scroll y Clics)

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // 1. Detectar Scroll para cambiar el fondo
    useEffect(() => {
        const handleScroll = () => {
            // Si baja más de 50px, cambia el estado
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Clases dinámicas: Transparente arriba, Negro/Blur al bajar
    const navClasses = scrolled
        ? "fixed top-0 left-0 w-full z-50 bg-slate-950/90 backdrop-blur-md py-4 shadow-lg transition-all duration-300 border-b border-white/5"
        : "fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent py-6 transition-all duration-300";

    return (
        <nav className={navClasses}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                {/* --- LOGO (Visible siempre) --- */}
                <Link href="/inicio" className="flex items-center group z-50 relative" onClick={() => setIsOpen(false)}>
                    <div className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center mr-3 transition-transform group-hover:scale-105">
                        {/* Logo PNG Transparente */}
                        <img src="/logo-main.png" alt="Parque Hípico Logo" className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-extrabold text-lg md:text-xl leading-none tracking-widest uppercase drop-shadow-sm">Parque Hípico</span>
                        <span className="text-amber-500 text-xs md:text-sm font-serif italic tracking-wide">La Montaña</span>
                    </div>
                </Link>

                {/* --- MENÚ DE ESCRITORIO (Oculto en celular) --- */}
                <div className="hidden lg:flex space-x-8 items-center">
                    {['Inicio', 'Eventos', 'Arrienda', 'Nosotros', 'Únete'].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase()}`}
                            className="text-white text-sm font-bold uppercase tracking-widest hover:text-amber-500 transition-colors relative group"
                        >
                            {item}
                            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                    <Link
                        href="/cotizar"
                        className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-sm py-3 px-6 rounded-full shadow-lg hover:shadow-amber-500/20 transition-all transform hover:-translate-y-1"
                    >
                        COTIZAR
                    </Link>
                </div>

                {/* --- BOTÓN HAMBURGUESA (Solo visible en celular) --- */}
                <button
                    className="lg:hidden text-white z-50 focus:outline-none p-2 bg-slate-800/50 rounded-full backdrop-blur-sm border border-white/10"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes size={24} className="text-amber-500" /> : <FaBars size={24} />}
                </button>

                {/* --- MENÚ MÓVIL DESPLEGABLE (Overlay) --- */}
                <div className={`fixed inset-0 bg-slate-950 z-40 flex flex-col justify-center items-center transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>

                    {/* Decoración de fondo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

                    <div className="flex flex-col space-y-8 text-center relative z-10">
                        {['Inicio', 'Eventos', 'Arrienda', 'Nosotros', 'Únete'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className="text-3xl font-extrabold text-white uppercase tracking-widest hover:text-amber-500 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                        <div className="h-4"></div> {/* Espaciador */}
                        <Link
                            href="/cotizar"
                            className="bg-amber-500 text-slate-900 font-extrabold text-lg py-4 px-12 rounded-full shadow-xl shadow-amber-500/20"
                            onClick={() => setIsOpen(false)}
                        >
                            COTIZAR AHORA
                        </Link>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
