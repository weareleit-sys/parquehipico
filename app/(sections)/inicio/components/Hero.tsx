export default function Hero() {
    return (
        <section id="inicio" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Imagen de Fondo */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero-bg.jpg"
                    alt="Carrera en Parque Hípico La Montaña"
                    className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-slate-950/60"></div>
            </div>

            {/* Contenido Principal */}
            <div className="relative z-20 container mx-auto px-4 text-center md:text-left pt-20 max-w-7xl">
                <div className="max-w-4xl mx-auto md:mx-0">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
                        El Centro de Eventos <br />
                        <span className="text-amber-500">más Versátil del Sur de Chile</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-100 mb-10 max-w-2xl font-light leading-relaxed drop-shadow-md">
                        Capacidad para 5.000 personas. 3 Hectáreas. Infraestructura para Festivales, Ferias y Carreras.
                    </p>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="/arrienda"
                            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-8 rounded shadow-lg transition-all transform hover:scale-105 flex items-center justify-center border border-amber-500"
                        >
                            Arrienda el Parque
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>

                        <a
                            href="/eventos"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-4 px-8 rounded transition-all flex items-center justify-center"
                        >
                            Ver Próximos Eventos
                        </a>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="absolute bottom-0 w-full border-t border-white/10 bg-slate-950/40 backdrop-blur-md z-20">
                <div className="container mx-auto px-4 py-6 max-w-7xl">
                    <div className="grid grid-cols-3 gap-4 text-center md:text-left">
                        <div>
                            <p className="text-3xl font-bold text-white">5.000</p>
                            <p className="text-xs md:text-sm text-slate-300 uppercase tracking-wider">Capacidad Personas</p>
                        </div>
                        <div className="border-l border-white/20 pl-4 md:pl-8">
                            <p className="text-3xl font-bold text-white">3</p>
                            <p className="text-xs md:text-sm text-slate-300 uppercase tracking-wider">Hectáreas</p>
                        </div>
                        <div className="border-l border-white/20 pl-4 md:pl-8">
                            <p className="text-3xl font-bold text-amber-500">24/7</p>
                            <p className="text-xs md:text-sm text-slate-300 uppercase tracking-wider">Seguridad</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
