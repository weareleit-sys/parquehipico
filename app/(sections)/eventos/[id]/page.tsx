import { getEventoPorId } from '../../data/eventos';
import CompraTickets from '../../components/CompraTickets';
import { notFound } from 'next/navigation';

export default function EventoDetallePage({ params }: { params: { id: string } }) {
    const evento = getEventoPorId(params.id);

    if (!evento) {
        notFound();
    }

    const fecha = new Date(evento.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <main className="pt-20">
            {/* Hero del Evento */}
            <section className="relative h-96 bg-slate-900">
                {/* 📸 FOTO NECESARIA: Imagen del evento específico */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8 border-4 border-dashed border-white/30">
                        <div>
                            <p className="text-2xl font-bold mb-4">📸 FOTO EVENTO</p>
                            <p className="text-lg">{evento.titulo}</p>
                            <p className="text-sm mt-2 opacity-80">Imagen promocional del evento</p>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-slate-950/40" />

                <div className="relative h-full container mx-auto px-4 max-w-7xl flex items-center">
                    <div className="text-white">
                        <span className={`
              inline-block text-xs font-bold px-3 py-1 rounded-full mb-4
              ${evento.categoria === 'CARRERA' ? 'bg-blue-500' : ''}
              ${evento.categoria === 'FIESTA' ? 'bg-purple-500' : ''}
              ${evento.categoria === 'FESTIVAL' ? 'bg-green-500' : ''}
            `}>
                            {evento.categoria}
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">{evento.titulo}</h1>
                        <p className="text-xl mb-2">{fechaFormateada}</p>
                        <p className="text-lg opacity-90">{evento.hora} hrs • {evento.ubicacion}</p>
                    </div>
                </div>
            </section>

            {/* Detalles del Evento */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Información Principal */}
                        <div className="md:col-span-2">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Sobre el Evento</h2>
                            <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                                {evento.descripcionLarga || evento.descripcion}
                            </p>

                            {evento.artistas && evento.artistas.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Artistas</h3>
                                    <ul className="space-y-2">
                                        {evento.artistas.map((artista, index) => (
                                            <li key={index} className="flex items-center gap-2 text-slate-700">
                                                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                {artista}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="bg-slate-50 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Información Importante</h3>
                                <ul className="space-y-3 text-slate-700">
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Las puertas abren 1 hora antes del evento</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span>Capacidad máxima: {evento.capacidad.toLocaleString()} personas</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Estacionamiento disponible</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span>Food trucks y zona gastronómica disponible</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar de Compra */}
                        <div>
                            <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200 sticky top-24">
                                <div className="text-center mb-6">
                                    <p className="text-sm text-slate-500 mb-2">Precio desde</p>
                                    <p className="text-4xl font-bold text-amber-600 mb-4">
                                        ${evento.precioDesde.toLocaleString('es-CL')}
                                    </p>
                                    <span className={`
                    inline-block text-sm font-semibold px-4 py-2 rounded-full
                    ${evento.estado === 'EN_VENTA' ? 'bg-green-100 text-green-700' : ''}
                    ${evento.estado === 'PROXIMAMENTE' ? 'bg-amber-100 text-amber-700' : ''}
                    ${evento.estado === 'AGOTADO' ? 'bg-red-100 text-red-700' : ''}
                  `}>
                                        {evento.estado === 'EN_VENTA' && '✓ Entradas Disponibles'}
                                        {evento.estado === 'PROXIMAMENTE' && '⏳ Próximamente'}
                                        {evento.estado === 'AGOTADO' && '✗ Agotado'}
                                    </span>
                                </div>

                                {evento.estado === 'EN_VENTA' && (
                                    <a
                                        href="#comprar"
                                        className="block w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded text-center transition-all mb-4"
                                    >
                                        Comprar Entradas
                                    </a>
                                )}

                                <div className="border-t border-slate-200 pt-4 space-y-3 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{fechaFormateada}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{evento.hora} hrs</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{evento.ubicacion}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de Compra */}
            {evento.estado === 'EN_VENTA' && (
                <div id="comprar">
                    <CompraTickets evento={evento} />
                </div>
            )}
        </main>
    );
}
