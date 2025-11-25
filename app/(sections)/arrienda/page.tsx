import { FaBriefcase, FaHeart, FaUsers, FaCheck, FaWhatsapp } from 'react-icons/fa';

export const metadata = {
    title: 'Productoras & Arriendos | Parque Hípico La Montaña',
    description: 'Infraestructura de 3 hectáreas para eventos masivos en Villarrica.',
};

// Datos locales para esta página
const tiposEventos = [
    { id: 1, titulo: "Eventos Corporativos", icono: 'briefcase', descripcion: "Lanzamientos de marca, fiestas de fin de año y team building." },
    { id: 2, titulo: "Matrimonios", icono: 'heart', descripcion: "Un entorno natural único para celebraciones inolvidables." },
    { id: 3, titulo: "Festivales Masivos", icono: 'users', descripcion: "Capacidad para 5.000+ personas con control de accesos." },
];

const especificaciones = {
    capacidad: 5000,
    superficie: 30000, // 3 hectáreas
    electricidad: "150",
    estacionamiento: 400
};

export default function ArriendaPage() {
    return (
        <main className="min-h-screen bg-slate-950 pt-20">
            {/* Hero B2B */}
            <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2 block">
                        Soluciones para Productoras
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
                        Arrienda el Parque
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                        Infraestructura profesional lista para operar. 3 Hectáreas, luz trifásica y ubicación estratégica en Villarrica.
                    </p>
                </div>
            </section>

            {/* Tipos de Eventos */}
            <section className="py-20 bg-slate-950">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {tiposEventos.map(tipo => (
                            <div key={tipo.id} className="bg-slate-900 p-8 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg">
                                <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-amber-500 text-2xl">
                                    {tipo.icono === 'briefcase' && <FaBriefcase />}
                                    {tipo.icono === 'heart' && <FaHeart />}
                                    {tipo.icono === 'users' && <FaUsers />}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{tipo.titulo}</h3>
                                <p className="text-slate-400 leading-relaxed">{tipo.descripcion}</p>
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
                        href="https://wa.me/56971636195?text=Hola,%20soy%20productor/a%20y%20necesito%20cotizar%20arriendo%20del%20Parque"
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
