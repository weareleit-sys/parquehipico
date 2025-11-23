'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link href="/inicio" className="flex items-center gap-3 group" onClick={closeMenu}>
          <div className="relative w-10 h-10 md:w-12 md:h-12">
            {/* 📸 FOTO NECESARIA: logo-main.jpg
                Descripción: Logo del Parque Hípico La Montaña
                Especificaciones:
                - Formato: JPG o PNG con fondo transparente
                - Tamaño: 200x200px mínimo
                - Contenido: Logo oficial del parque
                - Ubicación: /public/logo-main.jpg
            */}
            <div className="w-full h-full bg-white rounded-full overflow-hidden border-2 border-amber-600 group-hover:border-white transition-colors flex items-center justify-center">
              <span className="text-xs font-bold text-amber-600">LOGO</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold leading-none tracking-wide uppercase text-xs md:text-sm group-hover:text-amber-400 transition-colors">
              Parque Hípico
            </span>
            <span className="text-amber-500 font-serif text-base md:text-lg leading-none group-hover:text-white transition-colors">
              La Montaña
            </span>
          </div>
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/inicio"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors hover:border-b border-amber-500 pb-1"
          >
            Inicio
          </Link>
          <Link
            href="/eventos"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors hover:border-b border-amber-500 pb-1"
          >
            Eventos
          </Link>
          <Link
            href="/arrienda"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors hover:border-b border-amber-500 pb-1"
          >
            Arrienda el Parque
          </Link>
          <Link
            href="/nosotros"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors hover:border-b border-amber-500 pb-1"
          >
            Nosotros
          </Link>
          <Link
            href="/unete"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors hover:border-b border-amber-500 pb-1"
          >
            Únete
          </Link>
        </nav>

        {/* Botón CTA Desktop */}
        <a
          href="https://wa.me/56971636195?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20el%20Parque%20Hípico%20La%20Montaña"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center justify-center px-6 py-2 text-sm font-bold text-slate-900 transition-all bg-amber-500 rounded hover:bg-white hover:text-amber-600 shadow-md transform hover:-translate-y-0.5"
        >
          Cotizar
        </a>

        {/* Botón Menú Móvil */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white p-2 hover:text-amber-500 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menú Móvil Desplegable */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-white/10">
          <nav className="flex flex-col p-6 gap-4">
            <Link
              href="/inicio"
              onClick={closeMenu}
              className="text-lg font-medium text-slate-300 hover:text-amber-500 border-b border-white/5 pb-2"
            >
              Inicio
            </Link>
            <Link
              href="/eventos"
              onClick={closeMenu}
              className="text-lg font-medium text-slate-300 hover:text-amber-500 border-b border-white/5 pb-2"
            >
              Eventos
            </Link>
            <Link
              href="/arrienda"
              onClick={closeMenu}
              className="text-lg font-medium text-slate-300 hover:text-amber-500 border-b border-white/5 pb-2"
            >
              Arrienda el Parque
            </Link>
            <Link
              href="/nosotros"
              onClick={closeMenu}
              className="text-lg font-medium text-slate-300 hover:text-amber-500 border-b border-white/5 pb-2"
            >
              Nosotros
            </Link>
            <Link
              href="/unete"
              onClick={closeMenu}
              className="text-lg font-medium text-slate-300 hover:text-amber-500 border-b border-white/5 pb-2"
            >
              Únete
            </Link>
            <a
              href="https://wa.me/56971636195"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-center w-full py-3 text-base font-bold text-slate-900 bg-amber-500 rounded hover:bg-white hover:text-amber-600 transition-colors"
            >
              Cotizar Evento
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}