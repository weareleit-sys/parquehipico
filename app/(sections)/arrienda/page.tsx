import { tiposEventos, servicios, especificaciones } from './data/servicios';

export const metadata = {
    title: 'Arrienda el Parque | Parque Hípico La Montaña',
    description: 'Arrienda el Parque Hípico La Montaña para tu próximo evento. Capacidad para 5.000 personas, infraestructura completa.',
};

export default function ArriendaPage() {
    return (
        <main className="pt-20">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Arrienda el Parque</h1>
                    <p className="text-xl">Infraestructura profesional para tu próximo evento</p>
                </div>
            </section>

            {/* Tipos de Eventos */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Tipos de Eventos</h2>
                        <p className="text-lg text-slate-600">Amplios espacios adaptables para diferentes celebraciones</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {tiposEventos.map(tipo => (
                            <div key={tipo.id} className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                                <div className="w-16 h-16 bg-amber-500 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-3xl">
                                        {tipo.icono === 'briefcase' && '💼'}
                                        {tipo.icono === 'heart' && '💕'}
                                        {tipo.icono === 'users' && '👨‍👩‍👧‍👦'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{tipo.titulo}</h3>
                                <p className="text-slate-600">{tipo.descripcion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Qué Ofrecemos */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Qué Ofrecemos</h2>
                        <p className="text-lg text-slate-600">Un servicio integral para asegurar el éxito de tu evento</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {servicios.map(servicio => (
                            <div key={servicio.id} className="flex items-start gap-4 bg-white p-6 rounded-lg shadow">
                                <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">{servicio.titulo}</h4>
                                    <p className="text-sm text-slate-600">{servicio.descripcion}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Especificaciones Técnicas */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h2 className="text-4xl font-bold mb-12 text-center">Especificaciones Técnicas</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                            <h4 className="font-bold text-amber-500 mb-2">Capacidad</h4>
                            <p className="text-3xl font-bold mb-2">{especificaciones.capacidad.toLocaleString()}</p>
                            <p className="text-sm text-slate-300">personas</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                            <h4 className="font-bold text-amber-500 mb-2">Superficie</h4>
                            <p className="text-3xl font-bold mb-2">{especificaciones.superficie.toLocaleString()}</p>
                            <p className="text-sm text-slate-300">m²</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                            <h4 className="font-bold text-amber-500 mb-2">Electricidad</h4>
                            <p className="text-3xl font-bold mb-2">{especificaciones.electricidad}</p>
                            <p className="text-sm text-slate-300">kW trifásica</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                            <h4 className="font-bold text-amber-500 mb-2">Estacionamiento</h4>
                            <p className="text-3xl font-bold mb-2">{especificaciones.estacionamiento}</p>
                            <p className="text-sm text-slate-300">vehículos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">¿Listo para tu evento?</h2>
                    <p className="text-lg text-slate-600 mb-8">Contáctanos para una cotización personalizada</p>
                    <a
                        href="https://wa.me/56971636195?text=Hola,%20necesito%20información%20sobre%20arriendo%20del%20Parque%20Hípico%20La%20Montaña"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Solicitar Cotización por WhatsApp
                    </a>
                </div>
            </section>
        </main>
    );
}
