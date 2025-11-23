'use client';

import { useState } from 'react';
import { getEventosProximos, getEventosPorMes, type Evento } from '../data/eventos';

export default function CalendarioEventos() {
    const [mesActual, setMesActual] = useState(new Date());
    const eventosProximos = getEventosProximos(3);

    // Obtener días del mes
    const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
    const ultimoDia = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const primerDiaSemana = primerDia.getDay(); // 0 = Domingo

    // Eventos del mes actual
    const eventosDelMes = getEventosPorMes(mesActual.getMonth(), mesActual.getFullYear());

    // Función para cambiar mes
    const cambiarMes = (direccion: number) => {
        setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + direccion, 1));
    };

    // Función para verificar si un día tiene evento
    const tieneEvento = (dia: number): Evento | undefined => {
        return eventosDelMes.find(evento => {
            const fechaEvento = new Date(evento.fecha);
            return fechaEvento.getDate() === dia;
        });
    };

    // Nombres de meses y días
    const nombresMeses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Próximos Eventos</h2>
                    <p className="text-lg text-slate-600">Calendario público de eventos y carreras</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* CALENDARIO */}
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
                        {/* Header del calendario */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => cambiarMes(-1)}
                                className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <h3 className="text-2xl font-bold text-slate-900 capitalize">
                                {nombresMeses[mesActual.getMonth()]} de {mesActual.getFullYear()}
                            </h3>

                            <button
                                onClick={() => cambiarMes(1)}
                                className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Días de la semana */}
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {nombresDias.map(dia => (
                                <div key={dia} className="text-center text-sm font-semibold text-slate-600 py-2">
                                    {dia}
                                </div>
                            ))}
                        </div>

                        {/* Días del mes */}
                        <div className="grid grid-cols-7 gap-2">
                            {/* Espacios vacíos antes del primer día */}
                            {Array.from({ length: primerDiaSemana }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square" />
                            ))}

                            {/* Días del mes */}
                            {Array.from({ length: diasEnMes }).map((_, i) => {
                                const dia = i + 1;
                                const evento = tieneEvento(dia);
                                const esHoy = new Date().getDate() === dia &&
                                    new Date().getMonth() === mesActual.getMonth() &&
                                    new Date().getFullYear() === mesActual.getFullYear();

                                return (
                                    <div
                                        key={dia}
                                        className={`
                      aspect-square flex items-center justify-center rounded-lg text-sm font-medium
                      transition-all cursor-pointer relative
                      ${evento ? 'bg-amber-500 text-white hover:bg-amber-600' : 'hover:bg-slate-100'}
                      ${esHoy && !evento ? 'border-2 border-amber-500' : ''}
                      ${!evento ? 'text-slate-700' : ''}
                    `}
                                    >
                                        {dia}
                                        {evento && (
                                            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* PRÓXIMAS FECHAS */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Próximas Fechas</h3>

                        {eventosProximos.length > 0 ? (
                            eventosProximos.map(evento => {
                                const fecha = new Date(evento.fecha);
                                const dia = fecha.getDate();
                                const mes = nombresMeses[fecha.getMonth()].toUpperCase().slice(0, 3);

                                return (
                                    <div key={evento.id} className="bg-white rounded-lg shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
                                        <div className="flex gap-4">
                                            {/* Fecha destacada */}
                                            <div className="flex-shrink-0 w-16 h-16 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white">
                                                <span className="text-2xl font-bold">{dia}</span>
                                                <span className="text-xs font-semibold">{mes}</span>
                                            </div>

                                            {/* Información del evento */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`
                            text-xs font-bold px-3 py-1 rounded-full
                            ${evento.categoria === 'CARRERA' ? 'bg-blue-100 text-blue-700' : ''}
                            ${evento.categoria === 'FIESTA' ? 'bg-purple-100 text-purple-700' : ''}
                            ${evento.categoria === 'FESTIVAL' ? 'bg-green-100 text-green-700' : ''}
                          `}>
                                                        {evento.categoria}
                                                    </span>
                                                </div>

                                                <h4 className="text-xl font-bold text-slate-900 mb-1">{evento.titulo}</h4>
                                                <p className="text-sm text-slate-600 mb-2">{evento.descripcion}</p>

                                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {evento.hora} hrs
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        Capacidad: {evento.capacidad.toLocaleString()}
                                                    </span>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <span className={`
                            text-sm font-semibold
                            ${evento.estado === 'EN_VENTA' ? 'text-green-600' : ''}
                            ${evento.estado === 'PROXIMAMENTE' ? 'text-amber-600' : ''}
                            ${evento.estado === 'AGOTADO' ? 'text-red-600' : ''}
                          `}>
                                                        {evento.estado === 'EN_VENTA' && '✓ EN VENTA'}
                                                        {evento.estado === 'PROXIMAMENTE' && '⏳ PRÓXIMAMENTE'}
                                                        {evento.estado === 'AGOTADO' && '✗ AGOTADO'}
                                                    </span>

                                                    <a
                                                        href={`/eventos/${evento.id}`}
                                                        className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
                                                    >
                                                        Ver más
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-slate-50 rounded-lg p-8 text-center">
                                <p className="text-slate-600">No hay eventos próximos programados</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
