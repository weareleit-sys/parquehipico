import { FaBriefcase, FaHeart, FaUsers, FaWhatsapp } from 'react-icons/fa';

export const metadata = {
    title: 'Productoras & Arriendos | Parque Hípico La Montaña',
    description: 'Infraestructura de 3 hectáreas para eventos masivos en Villarrica.',
};

// Datos locales para esta página
const tiposEventos = [
    {
        id: 1,
        titulo: "Eventos Corporativos",
        icono: 'briefcase',
        descripcion: "Lanzamientos de marca, fiestas de fin de año y team building.",
        imagen: "/arrienda/corporativos.jpg"
    },
    {
        id: 2,
        titulo: "Matrimonios",
        icono: 'heart',
        descripcion: "Un entorno natural único para celebraciones inolvidables.",
        imagen: "/arrienda/matrimonios.jpg"
    },
    {
        id: 3,
        titulo: "Festivales Masivos",
        icono: 'users',
        descripcion: "Capacidad para 5.000+ personas con control de accesos.",
        imagen: "/arrienda/festivales.jpg"
    },
];

const especificaciones = {
    capacidad: 5000,
    superficie: 30000, // 3 hectáreas
    electricidad: "150",
    estacionamiento: 400
};

import ParallaxLogo from '@/components/UI/ParallaxLogo';

export default function ArriendaPage() {
    return (
        <main className="min-h-screen bg-slate-950">
            {/* HERO SECTION CON PARALLAX */}
            <ParallaxLogo maxOpacity={0.15} />

            {/* HERO B2B con nuevo diseño */}
            <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center overflow-hidden border-b border-slate-800">
                <div className="absolute inset-0">
                    <img
                        src="/arrienda/hero-bg.jpg"
                        alt="Arrienda el Parque"
                        className="w-full h-full object-cover object-center brightness-[0.4]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl translate-y-8">
                    <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-6 block animate-fade-in-up">
                        SOLUCIONES PARA PRODUCTORAS
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-none">
                        ARRIENDA <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">EL PARQUE</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
                        Infraestructura profesional lista para operar. 3 Hectáreas, luz trifásica y ubicación estratégica en Villarrica.
                    </p>
                </div>
            </section>

            {/* Tipos de Eventos */}
            <section className="py-20 bg-slate-950">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {tiposEventos.map(tipo => (
                            <div key={tipo.id} className="group relative overflow-hidden rounded-xl h-80 shadow-lg border border-slate-800">
                                {/* Imagen de Fondo */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url('${tipo.imagen}')` }}
                                ></div>
                                {/* Overlay Gradiente */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"></div>

                                {/* Contenido */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end relative z-10">
                                    <div className="w-14 h-14 bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-lg flex items-center justify-center mb-4 text-amber-500 text-2xl group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                                        {tipo.icono === 'briefcase' && <FaBriefcase />}
                                        {tipo.icono === 'heart' && <FaHeart />}
                                        {tipo.icono === 'users' && <FaUsers />}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{tipo.titulo}</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed text-shadow">{tipo.descripcion}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Specs Grid */}
            <section className="py-20 bg-slate-900 border-y border-slate-800">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">Ficha Técnica</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
                            <h4 className="font-bold text-amber-500 mb-2 text-sm uppercase">Capacidad</h4>
                            <p className="text-3xl md:text-4xl font-extrabold text-white">{especificaciones.capacidad.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-1">Personas</p>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
                            <h4 className="font-bold text-amber-500 mb-2 text-sm uppercase">Superficie</h4>
                            <p className="text-3xl md:text-4xl font-extrabold text-white">3 Has</p>
                            <p className="text-xs text-slate-500 mt-1">Terreno Plano</p>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
                            <h4 className="font-bold text-amber-500 mb-2 text-sm uppercase">Energía</h4>
                            <p className="text-3xl md:text-4xl font-extrabold text-white">T1</p>
                            <p className="text-xs text-slate-500 mt-1">Trifásica</p>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
                            <h4 className="font-bold text-amber-500 mb-2 text-sm uppercase">Parking</h4>
                            <p className="text-3xl md:text-4xl font-extrabold text-white">400+</p>
                            <p className="text-xs text-slate-500 mt-1">Vehículos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Galería del Recinto */}
            <section className="py-20 bg-slate-950">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h2 className="text-3xl font-bold text-white mb-4 text-center">Conoce Nuestro Espacio</h2>
                    <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                        Un recinto diseñado para eventos de gran escala con todas las comodidades
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                            <img src="/arrienda/recinto.jpg" alt="Vista del recinto" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <span className="absolute bottom-3 left-3 text-white font-semibold text-sm">Instalaciones</span>
                        </div>
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                            <img src="/arrienda/gastronomia.jpg" alt="Zona gastronómica" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <span className="absolute bottom-3 left-3 text-white font-semibold text-sm">Gastronomía</span>
                        </div>
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden group col-span-2 md:col-span-1">
                            <img src="/arrienda/fiesta.jpg" alt="Eventos y fiestas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <span className="absolute bottom-3 left-3 text-white font-semibold text-sm">Eventos</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 bg-slate-950 relative overflow-hidden">
                {/* Efecto de luz de fondo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full"></div>

                <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-6">¿Tienes un evento en mente?</h2>
                    <p className="text-lg text-slate-400 mb-10">
                        Agenda una visita técnica al predio. Atendemos productoras y particulares.
                    </p>
                    <a
                        href="https://wa.me/56993330628?text=Hola,%20soy%20productor/a%20y%20necesito%20cotizar%20arriendo%20del%20Parque"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-amber-900/20 transition-all transform hover:scale-105"
                    >
                        <FaWhatsapp className="text-2xl" />
                        Solicitar Visita Técnica
                    </a>
                </div>
            </section>
        </main>
    );
}
