import Link from 'next/link';
import type { Evento } from '../data/eventos';

interface EventoCardProps {
    evento: Evento;
}

export default function EventoCard({ evento }: EventoCardProps) {
    const fecha = new Date(evento.fecha);
    const dia = fecha.getDate();
    const mes = fecha.toLocaleDateString('es-CL', { month: 'short' }).toUpperCase();

    const categoriaColor = {
        'CARRERA': 'bg-blue-100 text-blue-700',
        'FIESTA': 'bg-purple-100 text-purple-700',
        'FESTIVAL': 'bg-green-100 text-green-700',
        'CORPORATIVO': 'bg-amber-100 text-amber-700',
        'FAMILIAR': 'bg-pink-100 text-pink-700'
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            {/* Imagen del evento */}
            <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 h-48">
                {/* 📸 FOTO NECESARIA: {evento.imagen}
            Descripción: Imagen promocional del evento "{evento.titulo}"
            Especificaciones:
            - Formato: JPG optimizado
            - Tamaño: 800x600px mínimo
            - Contenido: Imagen atractiva relacionada con el tipo de evento
            - Ubicación: /public{evento.imagen}
        */}
                <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4 border-4 border-dashed border-white/30">
                    <div>
                        <p className="text-xl font-bold mb-2">📸 FOTO EVENTO</p>
                        <p className="text-sm">{evento.titulo}</p>
                    </div>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoriaColor[evento.categoria]}`}>
                        {evento.categoria}
                    </span>
                    <span className="text-slate-500 text-sm">{evento.hora} hrs</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">{evento.titulo}</h3>
                <p className="text-slate-600 mb-4 line-clamp-2">{evento.descripcion}</p>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white">
                            <span className="text-lg font-bold">{dia}</span>
                            <span className="text-xs">{mes}</span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Desde</p>
                            <p className="text-xl font-bold text-amber-600">${evento.precioDesde.toLocaleString('es-CL')}</p>
                        </div>
                    </div>

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
                </div>

                <Link
                    href={`/eventos/${evento.id}`}
                    className="block w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded text-center transition-all"
                >
                    Ver Detalles
                </Link>
            </div>
        </div>
    );
}
