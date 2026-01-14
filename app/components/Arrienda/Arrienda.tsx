import Link from 'next/link';

export default function Arrienda() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decoración de fondo (mancha de color sutil) */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-50/50 -skew-x-12 translate-x-20 z-0"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Encabezado */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-6">
                        Tu Evento, <span className="text-amber-500">Nuestra Pasión</span>
                    </h2>
                    <p className="text-lg text-slate-600">
                        Disponemos de espacios versátiles y un entorno natural privilegiado para hacer de tu celebración un momento inolvidable.
                    </p>
                </div>

                {/* Grilla de Servicios */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">

                    {/* Tarjeta 1: Corporativos */}
                    <div className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            {/* Icono Grande de Fondo */}
                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2V9h-2V7h8v12zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" /></svg>
                        </div>

                        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                            {/* Icono Principal */}
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-3 font-display">Eventos Corporativos</h3>
                        <p className="text-slate-600 mb-6">
                            Lanzamientos de marca, seminarios y fiestas de fin de año con infraestructura de primer nivel.
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center text-sm text-slate-500"><span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>Salones climatizados</li>
                            <li className="flex items-center text-sm text-slate-500"><span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>Proyección y Audio</li>
                            <li className="flex items-center text-sm text-slate-500"><span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>Catering exclusivo</li>
                        </ul>
                    </div>

                    {/* Tarjeta 2: Matrimonios (Destacada) */}
                    <div className="group bg-slate-900 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden transform md:scale-105 z-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black opacity-50"></div>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        </div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-500/30">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 font-display">Matrimonios</h3>
                            <p className="text-slate-300 mb-6">
                                El escenario perfecto para el "Sí, acepto". Jardines de ensueño y elegancia en cada detalle.
                            </p>
                            <ul className="space-y-2 mb-8">
                                <li className="flex items-center text-sm text-slate-300"><span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>Capacidad 500+ personas</li>
                                <li className="flex items-center text-sm text-slate-300"><span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>Entorno fotográfico</li>
                                <li className="flex items-center text-sm text-slate-300"><span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>Coordinación integral</li>
                            </ul>

                            <Link href="/contacto" className="block w-full py-3 bg-amber-500 hover:bg-amber-600 text-white text-center font-bold rounded-xl transition-colors">
                                Cotizar Fecha
                            </Link>
                        </div>
                    </div>

                    {/* Tarjeta 3: Cumpleaños / Familia */}
                    <div className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2 0 1.1-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-5.69 5.86l-2.02-2.02-2.02 2.02-1.41-1.41L10.88 14.4l-2.02-2.02 1.41-1.41 2.02 2.02 2.02-2.02 1.41 1.41L13.7 14.4l2.02 2.02-1.41 1.41z" /></svg>
                        </div>

                        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-3 font-display">Celebraciones</h3>
                        <p className="text-slate-600 mb-6">
                            Cumpleaños, bautizos y reuniones familiares en un ambiente seguro y divertido.
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center text-sm text-slate-500"><span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>Juegos inflables</li>
                            <li className="flex items-center text-sm text-slate-500"><span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>Paseos en pony</li>
                            <li className="flex items-center text-sm text-slate-500"><span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>Quinchos equipados</li>
                        </ul>
                    </div>

                </div>

                {/* CTA General WhatsApp */}
                <div className="text-center">
                    <a href="https://wa.me/56993330628" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-green-500/40 gap-3">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                        Hablar con un Ejecutivo
                    </a>
                </div>

            </div>
        </section>
    );
}
