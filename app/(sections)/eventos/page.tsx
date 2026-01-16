import { eventos } from './data';
import EventoCard from '../../components/Eventos/EventoCard';
import { FaCalendarCheck } from 'react-icons/fa';

export const metadata = {
    title: 'Cartelera | Parque Hípico La Montaña',
    description: 'Próximas carreras, fiestas y eventos en Villarrica.',
};

import ParallaxLogo from '@/components/UI/ParallaxLogo';

export default function EventosPage() {
    return (
        <main className="min-h-screen bg-slate-950">
            {/* HERO SECTION CON PARALLAX */}
            <ParallaxLogo maxOpacity={0.15} />

            {/* HERO VISUAL PRINCIPAL */}
            <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center overflow-hidden border-b border-slate-800">
                <div className="absolute inset-0">
                    <img
                        src="/eventos/cartelera-bg.jpg"
                        alt="Cartelera de Eventos"
                        className="w-full h-full object-cover object-center brightness-[0.4]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-5xl translate-y-8">
                    <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-6 block animate-fade-in-up">
                        TEMPORADA 2026
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-none">
                        CARTELERA <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">OFICIAL</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                        Compra tus e-tickets de forma segura o reserva tus entradas para las carreras.
                        <span className="block mt-2 text-slate-400 text-sm">Operado por Parque Hípico La Montaña SpA</span>
                    </p>
                </div>
            </section>

            {/* Grid de Eventos */}
            <section className="py-20 relative z-10">
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
