import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebook, FaYoutube, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-slate-900">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

          {/* COL 1: MARCA */}
          <div>
            <h3 className="text-2xl font-extrabold uppercase tracking-wider mb-6">
              Parque Hípico<br /><span className="text-amber-500">La Montaña</span>
            </h3>
            <p className="text-slate-500 mb-6 leading-relaxed text-sm">
              El epicentro de eventos, tradición y naturaleza en la zona lacustre. Un espacio versátil diseñado para crear experiencias inolvidables.
            </p>
            <div className="flex space-x-3 mt-6">
              {/* Instagram */}
              <a href="https://www.instagram.com/parquehipicolamontana/" target="_blank" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all">
                <FaInstagram size={18} />
              </a>
              {/* Facebook */}
              <a href="https://web.facebook.com/profile.php?id=61579392327345" target="_blank" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                <FaFacebook size={18} />
              </a>
              {/* YouTube */}
              <a href="https://www.youtube.com/@Parqueh%C3%ADpicoLaMonta%C3%B1a" target="_blank" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all">
                <FaYoutube size={18} />
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@haras.as7" target="_blank" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white border border-slate-800 transition-all">
                <FaTiktok size={18} />
              </a>
            </div>
          </div>

          {/* COL 2: ENLACES RÁPIDOS */}
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-8">Navegación</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><Link href="/inicio" className="hover:text-amber-500 transition-colors">Inicio</Link></li>
              <li><Link href="/eventos" className="hover:text-amber-500 transition-colors">Calendario de Eventos</Link></li>
              <li><Link href="/arrienda" className="hover:text-amber-500 transition-colors">Arriendo para Empresas</Link></li>
              <li><Link href="/nosotros" className="hover:text-amber-500 transition-colors">Nuestra Historia</Link></li>
              <li><Link href="/contacto" className="hover:text-amber-500 transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* COL 3: LEGAL & DOCS */}
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-8">Información</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reglamento del Parque</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trabaja con Nosotros</a></li>
            </ul>
          </div>

          {/* COL 4: CONTACTO DIRECTO */}
          <div>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-8">Contacto</h4>
            <ul className="space-y-6 text-slate-500 text-sm">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-amber-500 flex-shrink-0" />
                <span>Km 4.5 Camino Villarrica - Loncoche<br />Región de la Araucanía, Chile</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-amber-500 flex-shrink-0" />
                <span>+56 9 7163 6195</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-amber-500 flex-shrink-0" />
                <span>contacto@parquehipico.cl</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>© 2025 Parque Hípico La Montaña. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span>Digital Partner</span>
            <span className="font-bold text-slate-400">ELEIT TECH</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
