import Link from 'next/link';
import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-slate-300 py-16 border-t border-slate-900 font-sans relative z-10">
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
              <a href="https://www.instagram.com/parquehipico.lamontana/" target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-3 rounded-full hover:bg-amber-500 hover:text-black transition-all duration-300">
                <FaInstagram size={18} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61579392327345" target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-3 rounded-full hover:bg-amber-500 hover:text-black transition-all duration-300">
                <FaFacebookF size={18} />
              </a>
              <a href="https://www.youtube.com/@parquehipicolamontana" target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-3 rounded-full hover:bg-amber-500 hover:text-black transition-all duration-300">
                <FaYoutube size={18} />
              </a>
              <a href="https://www.tiktok.com/@parquehipicolamontana" target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-3 rounded-full hover:bg-amber-500 hover:text-black transition-all duration-300">
                <FaTiktok size={18} />
              </a>
            </div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Navegación</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/inicio" className="hover:text-amber-500 transition-colors">Inicio</Link></li>
              <li><Link href="/eventos" className="hover:text-amber-500 transition-colors">Calendario de Eventos</Link></li>
              <li><Link href="/arrienda" className="hover:text-amber-500 transition-colors">Arriendo para Empresas</Link></li>
              <li><Link href="/nosotros" className="hover:text-amber-500 transition-colors">Nuestra Historia</Link></li>
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
                <a
                  href="https://www.google.com/maps/search/Cancha+Hipica+La+Monta%C3%B1a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-500 transition-colors"
                >
                  Nancahue S-743, PC G, Loncoche<br />Región de la Araucanía, Chile
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-amber-500 flex-shrink-0" />
                <a href="https://wa.me/56993330628" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+56 9 9333 0628</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-amber-500 flex-shrink-0" />
                <a href="mailto:weareleit@gmail.com" className="hover:text-white transition-colors">weareleit@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-slate-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>© 2026 Parque Hípico La Montaña. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            Digital Partner <span className="text-slate-400 font-bold">ELEIT TECH</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
