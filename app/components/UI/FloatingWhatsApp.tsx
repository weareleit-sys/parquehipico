import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsApp = () => {
    return (
        <a
            href="https://wa.me/56971636195"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-50 flex items-center group"
        >
            {/* Tooltip (Texto que aparece al lado) */}
            <div className="bg-white text-slate-900 px-4 py-2 rounded-full shadow-lg mr-4 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block">
                ¿Hablamos?
            </div>

            {/* Botón Circular con Efecto Pulse */}
            <div className="relative">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <div className="relative w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-green-600 transition-colors">
                    <FaWhatsapp size={32} />
                </div>
            </div>
        </a>
    );
};

export default FloatingWhatsApp;
