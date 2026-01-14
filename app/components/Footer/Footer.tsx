import Link from 'next/link';
import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-slate-300 py-16 border-t border-slate-900 font-sans">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* COLUMNA 1: MARCA */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <h2 className="text-white font-extrabold text-2xl uppercase tracking-widest">Parque Hípico</h2>
              <span className="text-amber-500 font-serif italic text-lg">La Montaña</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              El epicentro de eventos, tradición y naturaleza en la zona lacustre.
              Un espacio versátil diseñado para crear experiencias inolvidables.
            </p>
            <div className="flex gap-4">
              {[FaInstagram, FaFacebookF, FaYoutube, FaTiktok].map((Icon, i) => (
                <a key={i} href="#" className="bg-slate-900 p-3 rounded-full hover:bg-amber-500 hover:text-black transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Navegación</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/inicio" className="hover:text-amber-500 transition-colors">Inicio</Link></li>
              <li><Link href="/eventos" className="hover:text-amber-500 transition-colors">Calendario de Eventos</Link></li>
              <li><Link href="/arrienda" className="hover:text-amber-500 transition-colors">Arriendo para Empresas</Link></li>
              <li><Link href="/inicio#historia" className="hover:text-amber-500 transition-colors">Nuestra Historia</Link></li>
              <li><Link href="https://wa.me/56993330628" className="hover:text-amber-500 transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* COLUMNA 3: INFORMACIÓN */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Información</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Reglamento del Parque</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Política de Privacidad</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Trabaja con Nosotros</Link></li>
            </ul>
          </div>

          {/* COLUMNA 4: CONTACTO */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Contacto</h3>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-amber-500 mt-1 flex-shrink-0" />
                <span>Km 4.5 Camino Villarrica - Loncoche<br />Región de la Araucanía, Chile</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-amber-500 flex-shrink-0" />
                <a href="tel:+56993330628" className="hover:text-white transition-colors">+56 9 7163 6195</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-amber-500 flex-shrink-0" />
                <a href="mailto:contacto@parquehipico.cl" className="hover:text-white transition-colors">contacto@parquehipico.cl</a>
              </li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-slate-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>© 2025 Parque Hípico La Montaña. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            Digital Partner <span className="text-slate-400 font-bold">ELEIT TECH</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
