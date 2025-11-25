import React from 'react';
// Removed unused import

const Hero = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden">

            {/* 1. IMAGEN DE FONDO */}
            <div className="absolute inset-0">
                <img
                    src="/hero-bg.jpg"
                    alt="Parque Hípico La Montaña"
                    className="h-full w-full object-cover object-center brightness-50"
                />
                {/* Overlay degradado para que el texto se lea perfecto */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            </div>

            {/* 2. CONTENIDO PRINCIPAL (Texto Gigante) */}
            <div className="relative z-10 flex h-full flex-col justify-center px-6">
                <div className="max-w-7xl mx-auto w-full pt-20">
                    <div className="max-w-4xl">
                        {/* Titular exacto de la referencia */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
                            El Recinto de <br />
                            Eventos Masivos <br />
                            <span className="text-amber-500">más Versátil del Sur de Chile</span>
                        </h1>

                        {/* Subtítulo descriptivo */}
                        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl font-light leading-relaxed">
                            Capacidad para 5.000 personas. 3 Hectáreas. Infraestructura para Festivales, Ferias y Carreras.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. BARRA DE ESTADÍSTICAS (Bottom Bar) */}
            <div className="absolute bottom-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-white/10 z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between">

                        {/* Datos Numéricos */}
                        <div className="flex divide-x divide-slate-700 w-full md:w-auto py-6">

                            {/* Dato 1 */}
                            <div className="px-6 md:pl-0 md:pr-12 text-center md:text-left">
                                <span className="block text-4xl font-extrabold text-white">5.000</span>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Capacidad Personas</span>
                            </div>

                            {/* Dato 2 */}
                            <div className="px-6 md:px-12 text-center md:text-left">
                                <span className="block text-4xl font-extrabold text-white">3</span>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Hectáreas</span>
                            </div>

                            {/* Dato 3 */}
                            <div className="px-6 md:px-12 text-center md:text-left">
                                <span className="block text-4xl font-extrabold text-amber-500">24/7</span>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Seguridad</span>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
