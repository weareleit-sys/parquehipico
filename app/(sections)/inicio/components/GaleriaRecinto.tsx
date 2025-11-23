export default function GaleriaRecinto() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Conoce Nuestro Recinto</h2>
                    <p className="text-lg text-slate-600">Fotos profesionales del parque y sus instalaciones</p>
                </div>

                {/* Vista General */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Vista General</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-8 flex items-center justify-center text-white text-center border-4 border-dashed border-white/30 min-h-[300px]">
                            <div>
                                <p className="font-bold text-xl mb-2">📸 FOTO 1 NECESARIA</p>
                                <p className="text-sm">Vista Aérea Completa</p>
                                <p className="text-xs mt-2 opacity-80">
                                    Toma con dron desde 50-100m de altura. Día despejado, luz de mediodía. Mostrar todo el terreno, límites, accesos, pista, tribunas, estacionamiento.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-8 flex items-center justify-center text-white text-center border-4 border-dashed border-white/30 min-h-[300px]">
                            <div>
                                <p className="font-bold text-xl mb-2">📸 FOTO 2 NECESARIA</p>
                                <p className="text-sm">Entrada Principal</p>
                                <p className="text-xs mt-2 opacity-80">
                                    Portón de acceso principal desde la calle. Día, luz natural. Mostrar letrero del parque y acceso vehicular.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Más fotos */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 flex items-center justify-center text-white text-center border-4 border-dashed border-white/30 min-h-[200px]">
                        <div>
                            <p className="font-bold mb-2">📸 FOTO 3</p>
                            <p className="text-xs">Vista Panorámica desde Tribunas</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 flex items-center justify-center text-white text-center border-4 border-dashed border-white/30 min-h-[200px]">
                        <div>
                            <p className="font-bold mb-2">📸 FOTO 4</p>
                            <p className="text-xs">Vista Aérea Nocturna con Iluminación</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 flex items-center justify-center text-white text-center border-4 border-dashed border-white/30 min-h-[200px]">
                        <div>
                            <p className="font-bold mb-2">📸 FOTO 5</p>
                            <p className="text-xs">Vista General del Estacionamiento</p>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <a
                        href="/GUIA_CONTENIDO_FALTANTE.md"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Ver Guía Completa de Fotos Necesarias
                    </a>
                </div>
            </div>
        </section>
    );
}
