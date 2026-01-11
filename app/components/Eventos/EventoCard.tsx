"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaCalendarAlt, FaMusic, FaTicketAlt, FaWhatsapp, FaCreditCard, FaMinus, FaPlus } from 'react-icons/fa';
import { Evento } from '../../(sections)/eventos/data';

interface EventoProps {
    evento: Evento;
}

interface Attendee {
    nombre: string;
    tipo: 'hombre' | 'mujer';
}

export default function EventoCard({ evento }: EventoProps) {
    const [showTicketSelector, setShowTicketSelector] = useState(false);

    // Cantidades separadas para hombres y mujeres
    const [qtyHombres, setQtyHombres] = useState(0);
    const [qtyMujeres, setQtyMujeres] = useState(0);

    const [buyerEmail, setBuyerEmail] = useState('');
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState(false);

    // Precios
    const precioHombres = evento.precios.hombres
        ? parseInt(evento.precios.hombres.replace(/\./g, ''))
        : evento.precioInt;
    const precioMujeres = evento.precios.mujeres
        ? parseInt(evento.precios.mujeres.replace(/\./g, ''))
        : evento.precioInt;
    const precioGeneral = evento.precios.general
        ? parseInt(evento.precios.general.replace(/\./g, ''))
        : evento.precioInt;

    // Total
    const totalQty = qtyHombres + qtyMujeres;
    const totalPrice = evento.precios.general
        ? precioGeneral * totalQty
        : (qtyHombres * precioHombres) + (qtyMujeres * precioMujeres);

    // Actualizar lista de asistentes cuando cambian cantidades
    const updateAttendees = (newQtyHombres: number, newQtyMujeres: number) => {
        const newAttendees: Attendee[] = [];

        // Primero hombres
        for (let i = 0; i < newQtyHombres; i++) {
            const existing = attendees.filter(a => a.tipo === 'hombre')[i];
            newAttendees.push({ nombre: existing?.nombre || '', tipo: 'hombre' });
        }

        // Luego mujeres
        for (let i = 0; i < newQtyMujeres; i++) {
            const existing = attendees.filter(a => a.tipo === 'mujer')[i];
            newAttendees.push({ nombre: existing?.nombre || '', tipo: 'mujer' });
        }

        setAttendees(newAttendees);
    };

    const handleQtyHombres = (delta: number) => {
        const newQty = Math.max(0, qtyHombres + delta);
        setQtyHombres(newQty);
        updateAttendees(newQty, qtyMujeres);
    };

    const handleQtyMujeres = (delta: number) => {
        const newQty = Math.max(0, qtyMujeres + delta);
        setQtyMujeres(newQty);
        updateAttendees(qtyHombres, newQty);
    };

    const handlePayment = async () => {
        if (!buyerEmail || attendees.some(a => !a.nombre.trim())) {
            alert('Por favor completa el email y el nombre de TODOS los asistentes.');
            return;
        }

        if (totalQty === 0) {
            alert('Selecciona al menos 1 entrada.');
            return;
        }

        setLoading(true);

        // Guardar datos para procesar después del pago
        localStorage.setItem('pending_order', JSON.stringify({
            email: buyerEmail,
            attendees: attendees,
            eventName: evento.titulo,
            qtyHombres,
            qtyMujeres
        }));

        try {
            // Construir título descriptivo
            let title = evento.titulo;
            if (qtyHombres > 0 && qtyMujeres > 0) {
                title += ` (${qtyHombres}H + ${qtyMujeres}M)`;
            } else if (qtyHombres > 0) {
                title += ` (${qtyHombres} Hombre${qtyHombres > 1 ? 's' : ''})`;
            } else {
                title += ` (${qtyMujeres} Mujer${qtyMujeres > 1 ? 'es' : ''})`;
            }

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: `evento-${evento.id}-mixed`,
                    title: title,
                    quantity: 1, // Una transacción
                    unit_price: totalPrice,
                    name: attendees[0].nombre,
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

    const resetSelector = () => {
        setShowTicketSelector(false);
        setQtyHombres(0);
        setQtyMujeres(0);
        setAttendees([]);
        setBuyerEmail('');
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

                {/* ZONA DE COMPRA */}
                {showTicketSelector ? (
                    <div className="bg-slate-950 p-4 rounded-lg border border-amber-500/30 animate-in fade-in zoom-in-95 duration-200">

                        {/* Selectores de Cantidad Dual */}
                        {evento.precios.mujeres ? (
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {/* Hombres */}
                                <div className="bg-slate-800 rounded-lg p-3 text-center">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Hombres</span>
                                    <span className="text-amber-500 font-bold text-sm block mb-2">${evento.precios.hombres}</span>
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleQtyHombres(-1)}
                                            className="w-7 h-7 rounded bg-slate-700 text-amber-500 flex items-center justify-center hover:bg-slate-600"
                                        >
                                            <FaMinus size={10} />
                                        </button>
                                        <span className="text-white font-bold text-lg w-6 text-center">{qtyHombres}</span>
                                        <button
                                            onClick={() => handleQtyHombres(1)}
                                            className="w-7 h-7 rounded bg-slate-700 text-amber-500 flex items-center justify-center hover:bg-slate-600"
                                        >
                                            <FaPlus size={10} />
                                        </button>
                                    </div>
                                </div>

                                {/* Mujeres */}
                                <div className="bg-slate-800 rounded-lg p-3 text-center">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Mujeres</span>
                                    <span className="text-amber-500 font-bold text-sm block mb-2">${evento.precios.mujeres}</span>
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleQtyMujeres(-1)}
                                            className="w-7 h-7 rounded bg-slate-700 text-amber-500 flex items-center justify-center hover:bg-slate-600"
                                        >
                                            <FaMinus size={10} />
                                        </button>
                                        <span className="text-white font-bold text-lg w-6 text-center">{qtyMujeres}</span>
                                        <button
                                            onClick={() => handleQtyMujeres(1)}
                                            className="w-7 h-7 rounded bg-slate-700 text-amber-500 flex items-center justify-center hover:bg-slate-600"
                                        >
                                            <FaPlus size={10} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Precio general único
                            <div className="bg-slate-800 rounded-lg p-3 text-center mb-4">
                                <span className="text-amber-500 font-bold text-lg">${evento.precios.general}</span>
                                <div className="flex items-center justify-center gap-3 mt-2">
                                    <button
                                        onClick={() => {
                                            const newQty = Math.max(0, qtyHombres - 1);
                                            setQtyHombres(newQty);
                                            updateAttendees(newQty, 0);
                                        }}
                                        className="w-8 h-8 rounded bg-slate-700 text-amber-500 flex items-center justify-center"
                                    >
                                        <FaMinus size={12} />
                                    </button>
                                    <span className="text-white font-bold text-xl w-8 text-center">{qtyHombres}</span>
                                    <button
                                        onClick={() => {
                                            const newQty = qtyHombres + 1;
                                            setQtyHombres(newQty);
                                            updateAttendees(newQty, 0);
                                        }}
                                        className="w-8 h-8 rounded bg-slate-700 text-amber-500 flex items-center justify-center"
                                    >
                                        <FaPlus size={12} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Resumen de entradas */}
                        {totalQty > 0 && (
                            <div className="text-center mb-3 text-xs text-slate-400">
                                {qtyHombres > 0 && qtyMujeres > 0
                                    ? `${qtyHombres} hombre${qtyHombres > 1 ? 's' : ''} + ${qtyMujeres} mujer${qtyMujeres > 1 ? 'es' : ''}`
                                    : `${totalQty} entrada${totalQty > 1 ? 's' : ''}`
                                }
                            </div>
                        )}

                        {/* Email */}
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
                        {attendees.length > 0 && (
                            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
                                <label className="text-[10px] uppercase text-slate-500 font-bold block sticky top-0 bg-slate-950 z-10">Nombre de cada asistente</label>
                                {attendees.map((attendee, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${attendee.tipo === 'hombre' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'}`}>
                                            {attendee.tipo === 'hombre' ? 'H' : 'M'}
                                        </span>
                                        <input
                                            type="text"
                                            placeholder={`Nombre #${index + 1}`}
                                            className="flex-1 bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                                            value={attendee.nombre}
                                            onChange={(e) => {
                                                const newAttendees = [...attendees];
                                                newAttendees[index].nombre = e.target.value;
                                                setAttendees(newAttendees);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Total */}
                        <div className="flex justify-between items-end border-t border-slate-800 pt-3 mb-3">
                            <span className="text-xs text-slate-400">Total a Pagar</span>
                            <span className="text-xl font-bold text-amber-500">
                                ${totalPrice.toLocaleString('es-CL')}
                            </span>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={loading || totalQty === 0}
                            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-bold py-2.5 rounded shadow-lg text-sm flex justify-center items-center gap-2 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'PROCESANDO...' : <><FaCreditCard /> PAGAR AHORA</>}
                        </button>
                        <button
                            onClick={resetSelector}
                            className="w-full mt-2 text-xs text-slate-500 hover:text-white underline text-center"
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    // VISTA INICIAL: PRECIOS Y BOTÓN
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
