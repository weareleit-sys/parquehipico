export default function GaleriaRecinto() {
    // Estructura de fotos necesarias
    const fotosNecesarias = [
        {
            id: 1,
            categoria: 'Vista General',
            titulo: 'Vista Aérea Completa',
            descripcion: 'Toma con dron desde 50-100m de altura. Día despejado, luz de mediodía. Mostrar todo el terreno, límites, accesos, pista, tribunas, estacionamiento.',
            ruta: '/galeria/vista-aerea-completa.jpg'
        },
        {
            id: 2,
            categoria: 'Vista General',
            titulo: 'Entrada Principal',
            descripcion: 'Portón de acceso principal desde la calle. Día, luz natural. Mostrar letrero del parque y acceso vehicular.',
            ruta: '/galeria/entrada-principal.jpg'
        },
        {
            id: 3,
            categoria: 'Vista General',
            titulo: 'Vista Panorámica desde Tribunas',
            descripcion: 'Foto panorámica desde las tribunas hacia la pista. Día despejado. Mostrar la vista que tienen los espectadores.',
            ruta: '/galeria/vista-tribunas.jpg'
        },
        {
            id: 4,
            categoria: 'Vista General',
            titulo: 'Vista Aérea Nocturna',
            descripcion: 'Toma con dron de noche con iluminación. Mostrar capacidad de iluminación del recinto.',
            ruta: '/galeria/vista-nocturna.jpg'
        },
        {
            id: 5,
            categoria: 'Vista General',
            titulo: 'Vista General del Estacionamiento',
            descripcion: 'Foto del área de estacionamiento. Día. Mostrar capacidad de estacionamiento.',
            ruta: '/galeria/estacionamiento.jpg'
        }
    ];

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
                        {/* Foto Principal */}
                        <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
                            <div className="absolute inset-0 flex items-center justify-center p-8 text-white text-center border-4 border-dashed border-white/30">
                                <div>
                                    <p className="text-2xl font-bold mb-4">📸 FOTO 1 NECESARIA</p>
                                    <p className="text-lg font-semibold mb-2">{fotosNecesarias[0].titulo}</p>
                                    <p className="text-sm opacity-90">{fotosNecesarias[0].descripcion}</p>
                                    <p className="text-xs mt-4 opacity-75">Ubicación: {fotosNecesarias[0].ruta}</p>
                                </div>
                            </div>
                        </div>

                        {/* Foto Secundaria */}
                        <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
                            <div className="absolute inset-0 flex items-center justify-center p-8 text-white text-center border-4 border-dashed border-white/30">
                                <div>
                                    <p className="text-2xl font-bold mb-4">📸 FOTO 2 NECESARIA</p>
                                    <p className="text-lg font-semibold mb-2">{fotosNecesarias[1].titulo}</p>
                                    <p className="text-sm opacity-90">{fotosNecesarias[1].descripcion}</p>
                                    <p className="text-xs mt-4 opacity-75">Ubicación: {fotosNecesarias[1].ruta}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Más Fotos */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {fotosNecesarias.slice(2).map((foto) => (
                        <div
                            key={foto.id}
                            className="relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg overflow-hidden"
                            style={{ minHeight: '250px' }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center p-6 text-white text-center border-4 border-dashed border-white/30">
                                <div>
                                    <p className="text-xl font-bold mb-2">📸 FOTO {foto.id}</p>
                                    <p className="text-sm font-semibold mb-2">{foto.titulo}</p>
                                    <p className="text-xs opacity-90">{foto.descripcion}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enlace a Guía Completa */}
                <div className="text-center bg-amber-50 rounded-lg p-8">
                    <p className="text-slate-700 mb-4">
                        <strong>📋 Necesitan {fotosNecesarias.length} fotos profesionales para esta sección</strong>
                    </p>
                    <a
                        href="/GUIA_CONTENIDO_FALTANTE.md"
                        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded transition-all"
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
