'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-slate-950/95 backdrop-blur-md border-b border-white/10 shadow-lg'
        : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
        {/* Logo - Texto con línea decorativa */}
        <Link href="/inicio" className="flex items-center gap-3 group" onClick={closeMenu}>
          <span className={`font-extrabold tracking-tight text-base md:text-lg transition-all duration-300 ${isScrolled ? 'text-white' : 'text-white drop-shadow-lg'
            }`}>
            PARQUE HÍPICO
          </span>
          <span className={`hidden sm:block w-8 h-[2px] transition-all duration-300 ${isScrolled ? 'bg-amber-500' : 'bg-amber-400'
            }`}></span>
          <span className={`font-serif italic text-base md:text-lg transition-all duration-300 ${isScrolled ? 'text-amber-500 group-hover:text-amber-400' : 'text-amber-400 drop-shadow-lg group-hover:text-amber-300'
            }`}>
            La Montaña
          </span>
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/inicio"
            className={`text-sm font-medium transition-colors hover:border-b border-amber-500 pb-1 ${isScrolled ? 'text-slate-300 hover:text-white' : 'text-white/90 hover:text-white drop-shadow-md'
              }`}
          >
            Inicio
          </Link>
          <Link
            href="/eventos"
            className={`text-sm font-medium transition-colors hover:border-b border-amber-500 pb-1 ${isScrolled ? 'text-slate-300 hover:text-white' : 'text-white/90 hover:text-white drop-shadow-md'
              }`}
          >
            Eventos
          </Link>
          <Link
            href="/arrienda"
            className={`text-sm font-medium transition-colors hover:border-b border-amber-500 pb-1 ${isScrolled ? 'text-slate-300 hover:text-white' : 'text-white/90 hover:text-white drop-shadow-md'
              }`}
          >
            Arrienda el Parque
          </Link>
          <Link
            href="/nosotros"
            className={`text-sm font-medium transition-colors hover:border-b border-amber-500 pb-1 ${isScrolled ? 'text-slate-300 hover:text-white' : 'text-white/90 hover:text-white drop-shadow-md'
              }`}
          >
            Nosotros
          </Link>
          <Link
            href="/unete"
            className={`text-sm font-medium transition-colors hover:border-b border-amber-500 pb-1 ${isScrolled ? 'text-slate-300 hover:text-white' : 'text-white/90 hover:text-white drop-shadow-md'
              }`}
          >
            Únete
          </Link>
        </nav>

        {/* Botón CTA Desktop */}
        <a
          href="https://wa.me/56993330628?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20el%20Parque%20Hípico%20La%20Montaña"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center justify-center px-6 py-2 text-sm font-bold text-slate-900 transition-all bg-amber-500 rounded hover:bg-white hover:text-amber-600 shadow-md transform hover:-translate-y-0.5"
        >
          Cotizar
        </a>

        {/* Botón Menú Móvil */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white p-2 hover:text-amber-500 transition-colors drop-shadow-lg"
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
        <div className="md:hidden bg-slate-950/98 backdrop-blur-md border-b border-white/10">
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
              href="https://wa.me/56993330628"
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

