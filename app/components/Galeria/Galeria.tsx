import React from 'react';

const Galeria = () => {
    return (
        <section className="bg-slate-950 py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Conoce Nuestro Recinto</h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Un recorrido visual por nuestras 3 hectáreas de tradición y modernidad.
                    </p>
                </div>

                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">

                    {/* FOTO 1: Interior del Galpón (Grande) */}
                    <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group min-h-[300px]">
                        <img
                            src="/images/eventos/galpon-interior.jpg"
                            alt="Interior del Galpón"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent w-full">
                            <span className="text-white font-bold text-2xl">Galpón Principal</span>
                            <p className="text-gray-200 text-sm mt-1">Escenario, pantallas y capacidad para 2.000 personas</p>
                        </div>
                    </div>

                    {/* FOTO 2: Pista de Carreras */}
                    <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group min-h-[200px]">
                        <img
                            src="/images/eventos/pista-carreras.jpg"
                            alt="Pista de Carreras"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                        <div className="absolute bottom-4 left-4">
                            <span className="text-white font-bold bg-black/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Pista de Carreras</span>
                        </div>
                    </div>

                    {/* FOTO 3: Premiación */}
                    <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group min-h-[200px]">
                        <img
                            src="/images/eventos/premiacion-caballo.jpg"
                            alt="Premiación"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute bottom-4 left-4">
                            <span className="text-white font-bold bg-amber-500/90 px-3 py-1 rounded-full text-sm backdrop-blur-sm">🏆 Premiaciones</span>
                        </div>
                    </div>

                    {/* FOTO 4: Gastronomía (Asado) */}
                    <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group min-h-[200px]">
                        <img
                            src="/images/eventos/asado-palo.jpg"
                            alt="Asado al Palo"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                            <span className="text-white font-bold">🔥 Gastronomía Tradicional</span>
                        </div>
                    </div>

                    {/* FOTO 5: Ambiente y Celebración */}
                    <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group min-h-[200px]">
                        <img
                            src="/images/eventos/grupo-celebrando.jpg"
                            alt="Grupo Celebrando"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                            <span className="text-white font-bold">🎉 Ambiente Único</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Galeria;
