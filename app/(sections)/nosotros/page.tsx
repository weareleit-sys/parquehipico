export const metadata = {
    title: 'Nosotros | Parque Hípico La Montaña',
    description: 'Conoce más sobre el Parque Hípico La Montaña, nuestra historia, visión y misión.',
};

export default function NosotrosPage() {
    return (
        <main className="pt-20">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Nosotros</h1>
                    <p className="text-xl">Conoce la historia del Parque Hípico La Montaña</p>
                </div>
            </section>

            {/* Visión y Misión */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-slate-50 p-8 rounded-lg">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nuestra Visión</h2>
                            <p className="text-lg text-slate-700 leading-relaxed">
                                Ser el centro de eventos más reconocido del sur de Chile, ofreciendo experiencias memorables
                                que combinen tradición, naturaleza y entretenimiento de calidad para toda la familia.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-lg">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nuestra Misión</h2>
                            <p className="text-lg text-slate-700 leading-relaxed">
                                Proporcionar un espacio versátil y profesional para eventos de todo tipo, manteniendo viva
                                la tradición de las carreras a la chilena y promoviendo el desarrollo cultural y económico de la región.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Características del Parque */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Características del Parque</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { titulo: 'Ubicación Estratégica', descripcion: 'Fácil acceso desde la carretera principal, visible y accesible para todos.' },
                            { titulo: 'Infraestructura Completa', descripcion: 'Instalaciones modernas con todos los servicios necesarios para eventos de gran escala.' },
                            { titulo: 'Seguridad 24/7', descripcion: 'Perímetro controlado con personal de seguridad las 24 horas del día.' },
                            { titulo: 'Estacionamiento Amplio', descripcion: 'Capacidad para 500 vehículos con zonas diferenciadas.' },
                            { titulo: 'Versatilidad', descripcion: 'Espacios adaptables para diferentes tipos de eventos y configuraciones.' },
                            { titulo: 'Tradición', descripcion: 'Más de [X] años promoviendo la cultura ecuestre y eventos comunitarios.' }
                        ].map((caracteristica, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{caracteristica.titulo}</h3>
                                <p className="text-slate-600">{caracteristica.descripcion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ubicación */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Ubicación y Accesos</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Cómo Llegar</h3>
                            <div className="space-y-4 text-slate-700">
                                <p><strong>Dirección:</strong> [Dirección completa del parque]</p>
                                <p><strong>Desde la ciudad:</strong> [Instrucciones de cómo llegar]</p>
                                <p><strong>Transporte público:</strong> [Opciones de transporte público]</p>
                                <p><strong>Coordenadas GPS:</strong> [Coordenadas]</p>
                            </div>
                            <div className="mt-8">
                                <h4 className="font-bold text-slate-900 mb-3">Contacto</h4>
                                <p className="text-slate-700 mb-2">
                                    <strong>Teléfono:</strong> <a href="tel:+56971636195" className="text-amber-600 hover:text-amber-700">+56 9 7163 6195</a>
                                </p>
                                <p className="text-slate-700">
                                    <strong>Email:</strong> <a href="mailto:parquehipicolamontana@gmail.com" className="text-amber-600 hover:text-amber-700">parquehipicolamontana@gmail.com</a>
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-200 rounded-lg h-96 flex items-center justify-center">
                            {/* 📍 MAPA NECESARIO: Integrar Google Maps o mapa interactivo
                  Instrucciones:
                  - Obtener API key de Google Maps
                  - Agregar coordenadas exactas del parque
                  - Configurar marcador personalizado
                  - Mostrar rutas de acceso
              */}
                            <div className="text-center p-8">
                                <p className="text-lg font-bold text-slate-600 mb-2">🗺️ MAPA INTERACTIVO</p>
                                <p className="text-sm text-slate-500">Integrar Google Maps con ubicación del parque</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
