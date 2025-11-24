import React from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaTicketAlt } from 'react-icons/fa';

const eventos = [
    {
        id: 1,
        titulo: "Gran Carrera: Clásico de Otoño",
        fecha: "15 ABR",
        hora: "14:00 hrs",
        categoria: "Hípica",
        precio: "$5.000",
        imagen: "/hero-bg.jpg", // Usamos esta por ahora
        descripcion: "Las mejores cuadras del sur se enfrentan en 300 y 400 metros. Ambiente familiar y gastronomía típica.",
        estado: "Venta Activa"
    },
    {
        id: 2,
        titulo: "Festival Vive La Montaña 2025",
        fecha: "02 MAY",
        hora: "16:00 hrs",
        categoria: "Concierto",
        precio: "$15.000",
        imagen: "/hero-bg.jpg", // Cambiar cuando tengas el flyer
        descripcion: "Música en vivo, 3 escenarios, food trucks y la mejor fiesta del sur de Chile.",
        estado: "Próximamente"
    },
    {
        id: 3,
        titulo: "Feria Costumbrista & Emprendedores",
        fecha: "20 MAY",
        hora: "11:00 hrs",
        categoria: "Familiar",
        precio: "Gratis",
        imagen: "/hero-bg.jpg",
        descripcion: "Ven a disfrutar de artesanía local, productos del campo y juegos para niños.",
        estado: "Confirmado"
    }
];

const Calendario = () => {
    return (
        <section className="bg-slate-950 py-20 px-6" id="eventos">
            <div className="max-w-7xl mx-auto">

                {/* Encabezado con Botón de 'Ver Todo' */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="text-center md:text-left w-full md:w-auto">
                        <span className="text-orange-500 font-bold uppercase tracking-wider text-sm">Agenda 2025</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2">Próximos Eventos</h2>
                    </div>
                    <Link href="/eventos" className="hidden md:inline-flex items-center font-bold text-slate-600 hover:text-orange-500 transition-colors">
                        Ver calendario completo &rarr;
                    </Link>
                </div>

                {/* Grid de Eventos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {eventos.map((evento) => (
                        <div key={evento.id} className="bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-800 flex flex-col group">

                            {/* Imagen del Evento */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={evento.imagen}
                                    alt={evento.titulo}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
                                    <span className="text-slate-900 font-bold text-sm uppercase tracking-wider">{evento.categoria}</span>
                                </div>
                                {evento.estado === "Venta Activa" && (
                                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-lg shadow-sm animate-pulse">
                                        <span className="font-bold text-xs uppercase">Tickets Disponibles</span>
                                    </div>
                                )}
                            </div>

                            {/* Contenido de la Tarjeta */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center text-slate-500 text-sm mb-3 space-x-4">
                                    <div className="flex items-center text-orange-600 font-bold">
                                        <FaCalendarAlt className="mr-2" />
                                        {evento.fecha}
                                    </div>
                                    <div className="flex items-center">
                                        <FaClock className="mr-2" />
                                        {evento.hora}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-600 transition-colors">
                                    {evento.titulo}
                                </h3>

                                <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">
                                    {evento.descripcion}
                                </p>

                                {/* Footer de la Tarjeta */}
                                <div className="border-t border-slate-800 pt-4 flex items-center justify-between mt-auto">
                                    <div>
                                        <span className="block text-xs text-slate-400 uppercase">Valor Entrada</span>
                                        <span className="text-lg font-bold text-white">{evento.precio}</span>
                                    </div>
                                    <button className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-500 transition-colors flex items-center">
                                        <FaTicketAlt className="mr-2" />
                                        Comprar
                                    </button>
                                </div>
                            </div>
                        </div>
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
