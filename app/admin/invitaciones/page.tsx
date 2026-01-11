'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { eventos } from '../../(sections)/eventos/data'
import Link from 'next/link'

export default function InvitacionesPage() {
    const [loading, setLoading] = useState(false)
    const [nombre, setNombre] = useState('')
    const [selectedEventId, setSelectedEventId] = useState(eventos[0].id)
    const [ticket, setTicket] = useState<any>(null)
    const [qrImage, setQrImage] = useState('')
    const ticketRef = useRef<HTMLDivElement>(null)

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const eventoSeleccionado = eventos.find(e => e.id === Number(selectedEventId))
        const tituloEvento = eventoSeleccionado?.titulo || 'Evento Parque Hípico'

        try {
            const codigoUnico = `INVITACION-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`

            const { error } = await supabase
                .from('tickets')
                .insert({
                    nombre_cliente: nombre,
                    email_cliente: 'staff-invitacion@parquehipico.cl',
                    monto_pagado: 0,
                    estado: 'cortesia',
                    evento: tituloEvento,
                    codigo_qr: codigoUnico
                })

            if (error) throw error

            const qrDataUrl = await QRCode.toDataURL(codigoUnico, { width: 300, margin: 2 })
            setQrImage(qrDataUrl)

            setTicket({
                nombre,
                codigo: codigoUnico,
                evento: tituloEvento
            })

        } catch (err: any) {
            alert('Error: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleShare = async () => {
        if (!ticketRef.current) return

        try {
            // Esperar a que la imagen del QR esté cargada
            const qrImg = ticketRef.current.querySelector('img') as HTMLImageElement
            if (qrImg && !qrImg.complete) {
                await new Promise((resolve) => {
                    qrImg.onload = resolve
                    setTimeout(resolve, 1000) // Fallback timeout
                })
            }

            const canvas = await html2canvas(ticketRef.current, {
                backgroundColor: '#1a1a1a',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false
            })

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    alert('Error generando la imagen. Intenta de nuevo.')
                    return
                }

                const file = new File([blob], 'invitacion-parque.png', { type: 'image/png' })

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'Invitación Parque Hípico',
                        text: `Hola ${ticket.nombre}, aquí tienes tu invitación doble para ${ticket.evento}.`,
                        files: [file]
                    })
                } else {
                    // Fallback: descargar
                    const link = document.createElement('a')
                    link.download = `invitacion-${ticket.nombre.replace(/\s+/g, '-')}.png`
                    link.href = canvas.toDataURL()
                    link.click()
                    alert('Imagen descargada. Puedes enviarla manualmente por WhatsApp.')
                }
            }, 'image/png', 1.0)
        } catch (err) {
            console.error('Error al compartir:', err)
            alert('No se pudo compartir. Intenta descargar la imagen manualmente.')
        }
    }

    const resetForm = () => {
        setTicket(null)
        setNombre('')
        setQrImage('')
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 font-sans">
            <nav className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-2">
                    <Link href="/admin" className="text-gray-500 hover:text-gray-800">
                        ← Volver
                    </Link>
                    <h1 className="font-bold text-gray-800">Generar Invitación</h1>
                </div>
            </nav>

            <div className="max-w-md mx-auto">
                {!ticket ? (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
                                <select
                                    value={selectedEventId}
                                    onChange={(e) => setSelectedEventId(Number(e.target.value))}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white focus:ring-2 focus:ring-green-500 outline-none"
                                >
                                    {eventos.map(evento => (
                                        <option key={evento.id} value={evento.id}>
                                            {evento.titulo} ({evento.fecha})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Invitado</label>
                                <input
                                    type="text"
                                    required
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-lg text-black bg-white focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Ej: María Pérez"
                                />
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <p className="text-green-800 text-sm font-medium">✨ Asigna cortesía doble.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Generando...' : 'Generar Invitación'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        <div
                            ref={ticketRef}
                            className="bg-zinc-900 text-white p-8 rounded-none mx-auto shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
                            style={{ width: '100%', aspectRatio: '9/16', maxWidth: '350px' }}
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500"></div>

                            <div className="mt-8 mb-4">
                                <h3 className="text-amber-500 tracking-widest text-sm font-bold uppercase">Parque Hípico</h3>
                                <h1 className="text-xl font-serif italic mt-1 leading-tight">{ticket.evento}</h1>
                            </div>

                            <div className="my-auto w-full">
                                <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Invitación Oficial</p>
                                <h2 className="text-3xl font-bold text-white mb-6 break-words leading-tight">{ticket.nombre}</h2>

                                <div className="bg-white p-3 rounded-lg inline-block shadow-lg mb-6">
                                    {qrImage && <img src={qrImage} alt="QR Ticket" className="w-48 h-48" />}
                                </div>

                                <div className="inline-block bg-amber-600 text-black px-4 py-1 rounded-full font-bold text-sm mb-2">
                                    ADMISIÓN DOBLE
                                </div>
                                <p className="text-gray-400 text-xs">Válido para titular + 1 acompañante</p>
                            </div>

                            <div className="mb-8 opacity-50 text-[10px] uppercase tracking-widest">
                                Prohibida su venta • Uso exclusivo Staff
                                <br />ID: {ticket.codigo.slice(0, 15)}...
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <button
                                onClick={handleShare}
                                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 flex items-center justify-center gap-2"
                            >
                                <span>📲</span> Compartir por WhatsApp
                            </button>

                            <button
                                onClick={resetForm}
                                className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50"
                            >
                                Crear Otra
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
