"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaCalendarAlt, FaMusic, FaTicketAlt, FaWhatsapp, FaCreditCard, FaMinus, FaPlus } from 'react-icons/fa';
import { Evento } from '../../(sections)/eventos/data';

interface EventoProps {
    evento: Evento;
}

export default function EventoCard({ evento }: EventoProps) {
    const [showTicketSelector, setShowTicketSelector] = useState(false);
    const [qty, setQty] = useState(1);

    // Estado para la compra
    const [ticketType, setTicketType] = useState<'hombres' | 'mujeres'>('hombres'); // Default hombre
    const [buyerEmail, setBuyerEmail] = useState('');
    const [attendees, setAttendees] = useState<string[]>(['']); // Inicialmente 1 asistente vacío
    const [loading, setLoading] = useState(false);

    // Calcular precio según selección
    const currentPrice = ticketType === 'hombres'
        ? (evento.precios.hombres ? parseInt(evento.precios.hombres.replace(/\./g, '')) : evento.precioInt)
        : (evento.precios.mujeres ? parseInt(evento.precios.mujeres.replace(/\./g, '')) : evento.precioInt);

    const handlePayment = async () => {
        // Validar que todos los nombres estén llenos
        if (!buyerEmail || attendees.some(name => !name.trim())) {
            alert('Por favor completa el email y el nombre de TODOS los asistentes.');
            return;
        }

        setLoading(true);

        // Guardar datos completos para procesar DESPUÉS del pago
        localStorage.setItem('pending_order', JSON.stringify({
            email: buyerEmail,
            attendees: attendees,
            eventName: evento.titulo,
            ticketType: ticketType
        }));

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: `evento-${evento.id}-${ticketType}`,
                    title: `${evento.titulo} (${ticketType.toUpperCase()}) x${qty}`,
                    quantity: qty,
                    unit_price: currentPrice,
                    name: attendees[0], // Usamos el primer nombre como "Representante" para MercadoPago
                    email: buyerEmail
                })
            });

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('Error checkout:', data);
                alert('Error al iniciar el pago. Intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`group relative bg-slate-900 rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 ${evento.destacado ? 'border-amber-500/50' : 'border-slate-800'}`}>

            {/* Etiqueta de Estado */}
            <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${evento.estado === 'disponible' ? 'bg-green-500/90 text-white' : 'bg-slate-700/90 text-slate-300'
                    }`}>
                    {evento.estado === 'disponible' ? 'DISPONIBLE' : evento.estado === 'proximamente' ? 'PROXIMAMENTE' : evento.estado}
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
                {/* ZONA DE COMPRA */}
                {/* ------------------------------------------------------- */}

                {showTicketSelector ? (
                    <div className="bg-slate-950 p-4 rounded-lg border border-amber-500/30 animate-in fade-in zoom-in-95 duration-200">

                        {/* Selector Tipo Entrada */}
                        {evento.precios.mujeres && (
                            <div className="flex gap-2 mb-4 bg-slate-800 p-1 rounded-lg">
                                <button
                                    onClick={() => setTicketType('hombres')}
                                    className={`flex-1 py-1 text-xs font-bold rounded ${ticketType === 'hombres' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                                >
                                    HOMBRES (${evento.precios.hombres})
                                </button>
                                <button
                                    onClick={() => setTicketType('mujeres')}
                                    className={`flex-1 py-1 text-xs font-bold rounded ${ticketType === 'mujeres' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                                >
                                    MUJERES (${evento.precios.mujeres})
                                </button>
                            </div>
                        )}

                        {/* Cantidad */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-white text-sm font-bold">Cantidad</span>
                            <div className="flex items-center gap-3 bg-slate-800 rounded px-2 py-1">
                                <button
                                    onClick={() => {
                                        const newQty = Math.max(1, qty - 1);
                                        setQty(newQty);
                                        setAttendees(prev => prev.slice(0, newQty));
                                    }}
                                    className="text-amber-500 hover:text-white px-2"
                                >
                                    <FaMinus size={10} />
                                </button>
                                <span className="text-white w-4 text-center text-sm font-bold">{qty}</span>
                                <button
                                    onClick={() => {
                                        const newQty = qty + 1;
                                        setQty(newQty);
                                        setAttendees(prev => [...prev, '']);
                                    }}
                                    className="text-amber-500 hover:text-white px-2"
                                >
                                    <FaPlus size={10} />
                                </button>
                            </div>
                        </div>

                        {/* Datos Comprador (Email) */}
                        <div className="mb-4">
                            <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Email donde llegarán los tickets</label>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                                value={buyerEmail}
                                onChange={(e) => setBuyerEmail(e.target.value)}
                            />
                        </div>

                        {/* Lista de Asistentes */}
                        <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-1">
                            <label className="text-[10px] uppercase text-slate-500 font-bold block sticky top-0 bg-slate-950 z-10">Nombre de cada asistente</label>
                            {Array.from({ length: qty }).map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    placeholder={`Nombre Asistente #${index + 1}`}
                                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                                    value={attendees[index] || ''}
                                    onChange={(e) => {
                                        const newAttendees = [...attendees];
                                        newAttendees[index] = e.target.value;
                                        setAttendees(newAttendees);
                                    }}
                                />
                            ))}
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-end border-t border-slate-800 pt-3 mb-3">
                            <span className="text-xs text-slate-400">Total a Pagar</span>
                            <span className="text-xl font-bold text-amber-500">
                                ${(currentPrice * qty).toLocaleString('es-CL')}
                            </span>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-bold py-2.5 rounded shadow-lg text-sm flex justify-center items-center gap-2 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'PROCESANDO...' : <><FaCreditCard /> PAGAR AHORA</>}
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
                            <button
                                onClick={() => setShowTicketSelector(true)}
                                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
                            >
                                <FaTicketAlt /> COMPRAR TICKET
                            </button>
                        ) : (
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
