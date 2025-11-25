import { eventos } from './data';
import EventoCard from '../../components/Eventos/EventoCard';
import { FaCalendarCheck } from 'react-icons/fa';

export const metadata = {
    title: 'Cartelera | Parque Hípico La Montaña',
    description: 'Próximas carreras, fiestas y eventos en Villarrica.',
};

export default function EventosPage() {
    return (
        // Mantenemos el padding-top (pt-24) para que el Navbar fijo no tape el contenido
        <main className="min-h-screen bg-slate-950 pt-24">

            {/* Hero de Eventos */}
            <section className="relative py-24 bg-slate-900 border-b border-slate-800">
                <div className="absolute inset-0 bg-[url('/pattern-dark.png')] opacity-5"></div>
                <div className="container mx-auto px-4 max-w-7xl text-center relative z-10">
                    <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2 block">
                        Temporada 2025
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                        Cartelera Oficial
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Compra tus e-tickets de forma segura o reserva tus entradas para las carreras.
                        <span className="block mt-2 text-slate-500 text-sm">Operado por Parque Hípico La Montaña SpA</span>
                    </p>
                </div>
            </section>

            {/* Grid de Eventos */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-7xl">
                    {eventos.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {eventos.map(evento => (
                                <EventoCard key={evento.id} evento={evento} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                            <FaCalendarCheck className="mx-auto text-6xl text-slate-700 mb-4" />
                            <p className="text-xl text-slate-400">Pronto anunciaremos nuevas fechas.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
