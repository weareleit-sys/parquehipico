"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaWhatsapp } from 'react-icons/fa';

const navLinks = [
    { name: 'Inicio', href: '/inicio' },
    { name: 'Eventos', href: '/eventos' },
    { name: 'Arrienda', href: '/arrienda' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Únete', href: '/unete' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // 1. Detectar Scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 2. Bloquear Scroll del Body cuando el menú está abierto (Evita el "juego" de fondo)
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    // Clases dinámicas: 
    // Si el menú está abierto (isOpen), forzamos fondo transparente para que se fusione con el overlay
    const navClasses = scrolled && !isOpen
        ? "fixed top-0 left-0 w-full z-50 bg-slate-950/90 backdrop-blur-md py-4 shadow-lg transition-all duration-300 border-b border-white/5"
        : "fixed top-0 left-0 w-full z-50 bg-transparent py-6 transition-all duration-300"; // Transparente si está arriba O si el menú está abierto

    return (
        <nav className={navClasses}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-50">

                {/* LOGO */}
                <Link href="/inicio" className="flex items-center group" onClick={() => setIsOpen(false)}>
                    <div className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center mr-3 transition-transform group-hover:scale-105">
                        <img src="/logo-main.png" alt="Parque Hípico Logo" className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-extrabold text-lg md:text-xl leading-none tracking-widest uppercase drop-shadow-sm">Parque Hípico</span>
                        <span className="text-amber-500 text-xs md:text-sm font-serif italic tracking-wide">La Montaña</span>
                    </div>
                </Link>

                {/* MENÚ DE ESCRITORIO */}
                <div className="hidden lg:flex space-x-8 items-center">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-white text-sm font-bold uppercase tracking-widest hover:text-amber-500 transition-colors relative group"
                        >
                            {item.name}
                            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}

                    <a
                        href="https://wa.me/56993330628?text=Hola,%20quisiera%20cotizar%20un%20evento%20en%20el%20Parque"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-sm py-3 px-6 rounded-full shadow-lg hover:shadow-amber-500/20 transition-all transform hover:-translate-y-1"
                    >
                        <FaWhatsapp className="text-lg" />
                        COTIZAR
                    </a>
                </div>

                {/* BOTÓN MÓVIL (Hamburguesa/Cerrar) */}
                <button
                    className="lg:hidden text-white focus:outline-none p-2 bg-slate-800/50 rounded-full backdrop-blur-sm border border-white/10"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes size={24} className="text-amber-500" /> : <FaBars size={24} />}
                </button>
            </div>

            {/* --- MENÚ MÓVIL OVERLAY --- */}
            {/* CORRECCIÓN AQUÍ: justify-start + pt-32 para que no choque con el header */}
            <div className={`fixed inset-0 bg-slate-950 z-40 flex flex-col justify-start items-center pt-32 transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>

                {/* Fondos decorativos */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

                <div className="flex flex-col space-y-8 text-center relative z-10 w-full px-6 overflow-y-auto max-h-full pb-10">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-3xl font-extrabold text-white uppercase tracking-widest hover:text-amber-500 transition-colors py-2 border-b border-slate-800/50 w-full"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}

                    <div className="h-2"></div>

                    <a
                        href="https://wa.me/56993330628?text=Hola,%20quisiera%20cotizar%20un%20evento"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-amber-500 text-slate-900 font-extrabold text-lg py-4 px-12 rounded-full shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 w-full max-w-xs mx-auto"
                        onClick={() => setIsOpen(false)}
                    >
                        <FaWhatsapp /> COTIZAR AHORA
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
