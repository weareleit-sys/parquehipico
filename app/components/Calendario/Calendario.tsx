import React from 'react';
import Link from 'next/link';


import { eventos } from '../../(sections)/eventos/data';
import EventoCard from '../Eventos/EventoCard';

const Calendario = () => {
    return (
        <section className="bg-slate-950 py-20 px-6" id="eventos">
            <div className="max-w-7xl mx-auto">

                {/* Encabezado con Botón de 'Ver Todo' */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="text-center md:text-left w-full md:w-auto">
                        <span className="text-amber-500 font-bold uppercase tracking-wider text-sm">Agenda 2025</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2">Próximos Eventos</h2>
                    </div>
                    <Link href="/eventos" className="hidden md:inline-flex items-center font-bold text-slate-600 hover:text-amber-500 transition-colors">
                        Ver calendario completo &rarr;
                    </Link>
                </div>

                {/* Grid de Eventos Dinámico */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {eventos.map((evento) => (
                        <EventoCard key={evento.id} evento={evento} />
                    ))}
                </div>

                {/* Botón Móvil (Solo visible en pantallas chicas) */}
                <div className="mt-8 text-center md:hidden">
                    <Link href="/eventos" className="inline-block border-2 border-slate-200 text-slate-700 px-8 py-3 rounded-full font-bold hover:bg-slate-900 hover:text-white transition-colors">
                        Ver calendario completo
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default Calendario;
