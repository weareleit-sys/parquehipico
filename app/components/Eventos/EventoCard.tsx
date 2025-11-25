"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaCalendarAlt, FaMusic, FaTicketAlt, FaWhatsapp, FaCreditCard, FaMinus, FaPlus } from 'react-icons/fa';
import { Evento } from '../../eventos/data';

interface EventoProps {
    evento: Evento;
}

export default function EventoCard({ evento }: EventoProps) {
    const [showTicketSelector, setShowTicketSelector] = useState(false);
    const [qty, setQty] = useState(1);

    // Simulación del proceso de pago
    const handlePayment = () => {
        // AQUÍ CONECTAREMOS MERCADOPAGO / FLOW MÁS ADELANTE
        alert(`🛒 INICIANDO CHECKOUT\n\nEvento: ${evento.titulo}\nCantidad: ${qty} Entrada(s)\nTotal: $${(evento.precioInt * qty).toLocaleString('es-CL')}\n\nEmpresa: PARQUE HIPICO LA MONTAÑA SpA\n\n(Redirigiendo a pasarela de pago...)`);
    };

    return (
        <div className={`group relative bg-slate-900 rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 ${evento.destacado ? 'border-amber-500/50' : 'border-slate-800'}`}>

            {/* Etiqueta de Estado */}
            <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${evento.estado === 'disponible' ? 'bg-green-500/90 text-white' : 'bg-slate-700/90 text-slate-300'
                    }`}>
                    {evento.estado}
                </span>
            </div>

            {/* Imagen */}
            <div className="relative h-64 w-full bg-slate-800 overflow-hidden">
                {evento.imagen ? (
                    <Image
                        src={evento.imagen}
                        alt={evento.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-slate-800 text-slate-600">
                        <FaMusic className="text-5xl mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-50">Imagen Pronto</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
            </div>

            {/* Contenido */}
            <div className="p-6 relative">
                <div className="-mt-12 mb-4 inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-4 py-2 rounded-lg font-bold shadow-lg">
                    <FaCalendarAlt />
                    <span>{evento.fecha}</span>
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-2">{evento.titulo}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{evento.descripcion}</p>

                {/* Features */}
                <ul className="mb-6 space-y-1">
                    {evento.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-slate-300 text-xs">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> {feature}
                        </li>
                    ))}
                </ul>

                {/* ------------------------------------------------------- */}
                {/* ZONA DE COMPRA: Lógica Híbrida */}
                {/* ------------------------------------------------------- */}

                {showTicketSelector ? (
                    // VISTA 2: SELECTOR DE ENTRADAS (PuntoTicket Mode)
                    <div className="bg-slate-950 p-4 rounded-lg border border-amber-500/30 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-white text-sm font-bold">General</span>
                            <div className="flex items-center gap-3 bg-slate-800 rounded px-2 py-1">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-amber-500 hover:text-white px-2"><FaMinus size={10} /></button>
                                <span className="text-white w-4 text-center text-sm font-bold">{qty}</span>
                                <button onClick={() => setQty(qty + 1)} className="text-amber-500 hover:text-white px-2"><FaPlus size={10} /></button>
                            </div>
                        </div>

                        <div className="flex justify-between items-end border-t border-slate-800 pt-3 mb-3">
                            <span className="text-xs text-slate-400">Total a Pagar</span>
                            <span className="text-xl font-bold text-amber-500">${(evento.precioInt * qty).toLocaleString('es-CL')}</span>
                        </div>

                        <button
                            onClick={handlePayment}
                            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-bold py-2.5 rounded shadow-lg text-sm flex justify-center items-center gap-2 transform active:scale-95 transition-all"
                        >
                            <FaCreditCard /> PAGAR AHORA
                        </button>
                        <button
                            onClick={() => setShowTicketSelector(false)}
                            className="w-full mt-2 text-xs text-slate-500 hover:text-white underline text-center"
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    // VISTA 1: PRECIOS Y BOTÓN PRINCIPAL
                    <>
                        <div className="mb-6 bg-slate-800/50 p-3 rounded border border-slate-700/50">
                            {evento.precios.general ? (
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400 uppercase font-bold">Valor Entrada</span>
                                    <span className="text-xl font-bold text-white">${evento.precios.general}</span>
                                </div>
                            ) : (
                                <div className="flex justify-between gap-4">
                                    <div className="text-center"><span className="text-[10px] text-slate-500 block uppercase">Hombres</span><span className="text-lg font-bold text-white">${evento.precios.hombres}</span></div>
                                    <div className="w-[1px] bg-slate-700"></div>
                                    <div className="text-center"><span className="text-[10px] text-slate-500 block uppercase">Mujeres</span><span className="text-lg font-bold text-white">${evento.precios.mujeres}</span></div>
                                </div>
                            )}
                        </div>

                        {evento.tipoVenta === 'ticket' ? (
                            // BOTÓN TIPO PUNTOTICKET
                            <button
                                onClick={() => setShowTicketSelector(true)}
                                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
                            >
                                <FaTicketAlt /> COMPRAR TICKET
                            </button>
                        ) : (
                            // BOTÓN WHATSAPP / PUERTA
                            <a
                                href={`https://wa.me/56971636195?text=Hola,%20tengo%20dudas%20sobre%20entradas%20para%20${evento.titulo}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 border border-slate-700 hover:border-green-500"
                            >
                                <FaWhatsapp className="text-xl" />
                                Hablar con RR.PP
                            </a>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
