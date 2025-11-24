import React from 'react';

const Galeria = () => {
    return (
        <section className="bg-slate-950 py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Conoce Nuestro Recinto</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Un recorrido visual por nuestras 3 hectáreas de tradición y modernidad.
                    </p>
                </div>

                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">

                    {/* FOTO 1: Vista Aérea (Grande) */}
                    <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group min-h-[300px]">
                        {/* Cuando tengas la foto aérea, descomenta la línea de abajo y borra el div gris */}
                        {/* <img src="/images/aerea.jpg" alt="Vista Aérea" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /> */}
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-xl border-2 border-dashed border-slate-300">
                            📸 FOTO 1: Vista Aérea
                        </div>

                        <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent w-full">
                            <span className="text-white font-bold text-2xl">Vista Panorámica</span>
                            <p className="text-gray-200 text-sm mt-1">3 Hectáreas de naturaleza</p>
                        </div>
                    </div>

                    {/* FOTO 2: Entrada */}
                    <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group min-h-[200px]">
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold border-2 border-dashed border-slate-600">
                            📸 FOTO 2: Entrada
                        </div>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                        <div className="absolute bottom-4 left-4">
                            <span className="text-white font-bold bg-black/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Acceso Principal</span>
                        </div>
                    </div>

                    {/* FOTO 3: Tribunas */}
                    <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group min-h-[200px]">
                        <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 font-bold border-2 border-dashed border-slate-400">
                            📸 FOTO 3: Tribunas
                        </div>
                        <div className="absolute bottom-4 left-4">
                            <span className="text-slate-900 font-bold bg-white/80 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Tribunas</span>
                        </div>
                    </div>

                    {/* FOTO 4: Nocturna / Evento */}
                    <div className="md:col-span-2 md:row-span-1 relative rounded-3xl overflow-hidden group min-h-[200px]">
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-600 font-bold border-2 border-dashed border-slate-700">
                            📸 FOTO 4: Iluminación / Nocturna
                        </div>
                        <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/80 to-transparent w-full">
                            <span className="text-white font-bold text-xl">Eventos Nocturnos</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Galeria;
