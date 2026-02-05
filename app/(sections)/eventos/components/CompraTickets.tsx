'use client';

import { useState } from 'react';
import type { Evento } from '../data';

interface CompraTicketsProps {
    evento: Evento;
}

export default function CompraTickets({ evento }: CompraTicketsProps) {
    const [paso, setPaso] = useState(1);
    const [cantidad, setCantidad] = useState(1);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        rut: ''
    });

    const total = evento.precioDesde * cantidad;

    const cambiarCantidad = (delta: number) => {
        setCantidad(Math.max(1, Math.min(10, cantidad + delta)));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validarPaso2 = () => {
        return formData.nombre && formData.email && formData.telefono && formData.rut;
    };

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Comprar Entradas</h2>

                    {/* Indicador de pasos */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${paso >= 1 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                1
                            </div>
                            <div className={`w-16 h-1 ${paso >= 2 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${paso >= 2 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                2
                            </div>
                            <div className={`w-16 h-1 ${paso >= 3 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${paso >= 3 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                3
                            </div>
                        </div>
                    </div>

                    {/* Paso 1: Selección de cantidad */}
                    {paso === 1 && (
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-6 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Entrada General</h3>
                                        <p className="text-sm text-slate-600">Acceso general al evento</p>
                                    </div>
                                    <span className="text-2xl font-bold text-amber-600">
                                        ${evento.precioDesde.toLocaleString('es-CL')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium text-slate-700">Cantidad:</label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => cambiarCantidad(-1)}
                                            className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center font-bold transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="text-xl font-bold w-8 text-center">{cantidad}</span>
                                        <button
                                            onClick={() => cambiarCantidad(1)}
                                            className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center font-bold transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-lg font-semibold">Total:</span>
                                    <span className="text-3xl font-bold text-amber-600">
                                        ${total.toLocaleString('es-CL')}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setPaso(2)}
                                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded transition-all"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Paso 2: Datos del comprador */}
                    {paso === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Nombre Completo *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Juan Pérez"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="juan@ejemplo.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Teléfono (WhatsApp) *
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="+56 9 1234 5678"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        RUT *
                                    </label>
                                    <input
                                        type="text"
                                        name="rut"
                                        value={formData.rut}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="12.345.678-9"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setPaso(1)}
                                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 px-6 rounded transition-all"
                                >
                                    Volver
                                </button>
                                <button
                                    onClick={() => validarPaso2() && setPaso(3)}
                                    disabled={!validarPaso2()}
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continuar al Pago
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Paso 3: Confirmación */}
                    {paso === 3 && (
                        <div className="space-y-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Reserva Confirmada!</h3>
                                <p className="text-slate-600 mb-4">
                                    Recibirás tus entradas por email y WhatsApp
                                </p>
                                <div className="bg-white rounded-lg p-4 mb-4">
                                    <p className="text-sm text-slate-500 mb-2">Resumen de compra:</p>
                                    <p className="font-semibold">{cantidad} entrada(s) para {evento.titulo}</p>
                                    <p className="text-2xl font-bold text-amber-600 mt-2">
                                        ${total.toLocaleString('es-CL')}
                                    </p>
                                </div>
                                <p className="text-sm text-slate-500">
                                    💡 En el futuro, aquí se integrará el pago con MercadoPago o Flow
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setPaso(1);
                                    setCantidad(1);
                                    setFormData({ nombre: '', email: '', telefono: '', rut: '' });
                                }}
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded transition-all"
                            >
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
