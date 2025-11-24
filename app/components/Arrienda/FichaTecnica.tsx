import React from 'react';
import Link from 'next/link';
import { FaFilePdf, FaCheckCircle, FaWhatsapp, FaBolt, FaParking, FaShieldAlt } from 'react-icons/fa';

const FichaTecnica = () => {
    return (
        <section className="bg-slate-900 py-20 px-6 relative overflow-hidden">
            {/* Elemento decorativo de fondo */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Columna Izquierda: Texto y CTA */}
                    <div>
                        <span className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-2 block">
                            Para Productoras y Empresas
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                            Arrienda el Parque <br />
                            <span className="text-slate-400">para tu próximo gran evento.</span>
                        </h2>
                        <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                            Infraestructura profesional lista para operar. Desde festivales masivos hasta ferias corporativas. Te entregamos el recinto llave en mano con soporte logístico local.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="https://wa.me/56971636195" target="_blank" className="inline-flex justify-center items-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 shadow-lg shadow-green-500/20">
                                <FaWhatsapp className="mr-2 text-xl" />
                                Cotizar por WhatsApp
                            </Link>
                            <button className="inline-flex justify-center items-center bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-4 px-8 rounded-full transition-all">
                                <FaFilePdf className="mr-2" />
                                Descargar Ficha Técnica
                            </button>
                        </div>
                    </div>

                    {/* Columna Derecha: Grid de Especificaciones */}
                    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700">
                        <h3 className="text-white font-bold text-xl mb-6 border-b border-slate-700 pb-4">
                            Especificaciones Técnicas
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* Item 1 */}
                            <div className="flex items-start">
                                <div className="bg-slate-700 p-3 rounded-lg mr-4 text-orange-500">
                                    <FaCheckCircle size={20} />
                                </div>
                                <div>
                                    <span className="block text-slate-400 text-sm">Capacidad</span>
                                    <span className="block text-white font-bold text-lg">5.000 Personas</span>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="flex items-start">
                                <div className="bg-slate-700 p-3 rounded-lg mr-4 text-blue-500">
                                    <FaBolt size={20} />
                                </div>
                                <div>
                                    <span className="block text-slate-400 text-sm">Energía</span>
                                    <span className="block text-white font-bold text-lg">400 kW Trifásica</span>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="flex items-start">
                                <div className="bg-slate-700 p-3 rounded-lg mr-4 text-white">
                                    <FaParking size={20} />
                                </div>
                                <div>
                                    <span className="block text-slate-400 text-sm">Estacionamiento</span>
                                    <span className="block text-white font-bold text-lg">500 Vehículos</span>
                                </div>
                            </div>

                            {/* Item 4 */}
                            <div className="flex items-start">
                                <div className="bg-slate-700 p-3 rounded-lg mr-4 text-green-500">
                                    <FaShieldAlt size={20} />
                                </div>
                                <div>
                                    <span className="block text-slate-400 text-sm">Seguridad</span>
                                    <span className="block text-white font-bold text-lg">Cierre Perimetral 24/7</span>
                                </div>
                            </div>

                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-700">
                            <p className="text-slate-400 text-sm text-center">
                                * Planos y checklist para productoras disponibles bajo solicitud.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FichaTecnica;
