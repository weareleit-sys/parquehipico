import React from 'react';
import Link from 'next/link';
import { FaTools, FaMapMarkedAlt, FaHorseHead } from 'react-icons/fa';

const Servicios = () => {
    return (
        <section className="bg-slate-900 py-24 px-6 relative overflow-hidden">
            {/* Decoración de fondo sutil */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-900 opacity-50 z-0"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Encabezado */}
                <div className="mb-20 text-center md:text-left">
                    <span className="text-amber-500 font-extrabold uppercase tracking-[0.2em] text-sm mb-4 block">
                        Nuestros Servicios
                    </span>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mt-2 leading-tight">
                        Infraestructura profesional <br className="hidden md:block" />
                        y experiencias únicas.
                    </h2>
                </div>

                {/* Grid de Servicios */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* TARJETA 1 - DARK MODE */}
                    <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-8 text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all duration-300">
                            <FaTools size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Producción de Eventos</h3>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Espacios modulares para festivales, conciertos y eventos corporativos. Infraestructura completa: escenario, backstage y electricidad trifásica.
                        </p>
                        <Link href="/servicios" className="inline-flex items-center text-amber-500 font-bold border-b border-amber-500/30 hover:border-amber-500 pb-1 transition-colors">
                            Ver especificaciones <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
                        </Link>
                    </div>

                    {/* TARJETA 2 - DARK MODE */}
                    <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-8 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                            <FaMapMarkedAlt size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Arriendo de Espacios</h3>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            30.000 m² disponibles. Zonas diferenciadas: público, VIP, backstage. Perímetro controlado 24/7 y accesos optimizados.
                        </p>
                        <Link href="/arrienda" className="inline-flex items-center text-blue-400 font-bold border-b border-blue-400/30 hover:border-blue-400 pb-1 transition-colors">
                            Solicitar cotización <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
                        </Link>
                    </div>

                    {/* TARJETA 3 - DARK MODE */}
                    <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] hover:-translate-y-2 transition-all duration-300 group">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-8 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                            <FaHorseHead size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Hípica Deportiva</h3>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Carreras a la Chilena profesionales. Calendario oficial, resultados históricos y reglamento. La mejor cancha del sur.
                        </p>
                        <Link href="/eventos" className="inline-flex items-center text-green-400 font-bold border-b border-green-400/30 hover:border-green-400 pb-1 transition-colors">
                            Ver calendario <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Servicios;
