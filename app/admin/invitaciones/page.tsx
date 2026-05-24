'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import QRCode from 'qrcode'
import Link from 'next/link'
import { eventos } from '../../(sections)/eventos/data'

type TipoInvitacion = 'doble' | 'staff'

export default function InvitacionesPage() {
    const [loading, setLoading] = useState(false)
    const [nombre, setNombre] = useState('')
    const [selectedEventId, setSelectedEventId] = useState(eventos[0].id)
    const [tipoInvitacion, setTipoInvitacion] = useState<TipoInvitacion>('doble')
    const [ticket, setTicket] = useState<any>(null)
    const [qrImage, setQrImage] = useState('')
    const ticketRef = useRef<HTMLDivElement>(null)

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const eventoSeleccionado = eventos.find(e => e.id === Number(selectedEventId))
        const tituloEvento = eventoSeleccionado?.titulo || 'Evento Parque Hípico'

        const prefijo = tipoInvitacion === 'doble' ? 'VIP' : 'STAFF'
        const codigoUnico = `${prefijo}-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`

        try {
            const { error } = await supabase
                .from('tickets')
                .insert({
                    nombre_cliente: nombre,
                    email_cliente: 'staff-invitacion@parquehipico.cl',
                    monto_pagado: 0,
                    estado: 'cortesia',
                    evento: tituloEvento,
                    codigo_qr: codigoUnico,
                    tipo_invitacion: tipoInvitacion
                })

            if (error) throw error

            const qrDataUrl = await QRCode.toDataURL(codigoUnico, { width: 300, margin: 2 })
            setQrImage(qrDataUrl)

            setTicket({
                nombre,
                codigo: codigoUnico,
                evento: tituloEvento,
                tipo: tipoInvitacion
            })

        } catch (err: any) {
            alert('Error: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const generateTicketCanvas = async (): Promise<Blob | null> => {
        return new Promise(async (resolve) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) { resolve(null); return }

            const width = 540
            const height = 960
            canvas.width = width
            canvas.height = height

            // Fondo oscuro
            ctx.fillStyle = '#18181b'
            ctx.fillRect(0, 0, width, height)

            // Línea superior — dorada para VIP, azul para staff
            const gradient = ctx.createLinearGradient(0, 0, width, 0)
            if (ticket.tipo === 'doble') {
                gradient.addColorStop(0, '#f59e0b')
                gradient.addColorStop(0.5, '#ef4444')
                gradient.addColorStop(1, '#f59e0b')
            } else {
                gradient.addColorStop(0, '#3b82f6')
                gradient.addColorStop(0.5, '#6366f1')
                gradient.addColorStop(1, '#3b82f6')
            }
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, width, 8)

            // Título
            ctx.fillStyle = ticket.tipo === 'doble' ? '#f59e0b' : '#60a5fa'
            ctx.font = 'bold 16px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('PARQUE HÍPICO', width / 2, 60)

            ctx.fillStyle = '#ffffff'
            ctx.font = 'italic 24px Georgia'
            ctx.fillText(ticket.evento, width / 2, 100)

            const tipoLabel = ticket.tipo === 'doble' ? 'INVITACIÓN OFICIAL' : 'PERSONAL AUTORIZADO'
            ctx.fillStyle = '#9ca3af'
            ctx.font = '12px Arial'
            ctx.fillText(tipoLabel, width / 2, 160)

            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 36px Arial'
            ctx.fillText(ticket.nombre, width / 2, 210)

            const qrImg = new Image()
            qrImg.onload = () => {
                const qrSize = 220
                const qrX = (width - qrSize) / 2
                const qrY = 260

                ctx.fillStyle = '#ffffff'
                ctx.beginPath()
                ctx.roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 10)
                ctx.fill()
                ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

                // Badge según tipo
                if (ticket.tipo === 'doble') {
                    ctx.fillStyle = '#d97706'
                    ctx.beginPath()
                    ctx.roundRect(width / 2 - 90, 520, 180, 32, 16)
                    ctx.fill()
                    ctx.fillStyle = '#000000'
                    ctx.font = 'bold 14px Arial'
                    ctx.fillText('ADMISIÓN DOBLE', width / 2, 542)
                    ctx.fillStyle = '#9ca3af'
                    ctx.font = '12px Arial'
                    ctx.fillText('Válido para titular + 1 acompañante', width / 2, 580)
                } else {
                    ctx.fillStyle = '#3b82f6'
                    ctx.beginPath()
                    ctx.roundRect(width / 2 - 110, 520, 220, 32, 16)
                    ctx.fill()
                    ctx.fillStyle = '#ffffff'
                    ctx.font = 'bold 14px Arial'
                    ctx.fillText('PERSONAL AUTORIZADO', width / 2, 542)
                    ctx.fillStyle = '#9ca3af'
                    ctx.font = '12px Arial'
                    ctx.fillText('Acceso individual', width / 2, 580)
                }

                ctx.fillStyle = '#6b7280'
                ctx.font = '10px Arial'
                ctx.fillText('Prohibida su venta • Uso exclusivo Staff', width / 2, height - 60)
                ctx.fillText(`ID: ${ticket.codigo.slice(0, 20)}...`, width / 2, height - 40)

                canvas.toBlob((blob) => { resolve(blob) }, 'image/png', 1.0)
            }
            qrImg.onerror = () => { resolve(null) }
            qrImg.src = qrImage
        })
    }

    const handleShare = async () => {
        try {
            const blob = await generateTicketCanvas()
            if (!blob) { alert('Error generando la imagen. Intenta de nuevo.'); return }

            const file = new File([blob], 'invitacion-parque.png', { type: 'image/png' })

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Invitación Parque Hípico',
                    text: `Hola ${ticket.nombre}, aquí tienes tu invitación para ${ticket.evento}.`,
                    files: [file]
                })
            } else {
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.download = `invitacion-${ticket.nombre.replace(/\s+/g, '-')}.png`
                link.href = url
                link.click()
                URL.revokeObjectURL(url)
                alert('Imagen descargada. Puedes enviarla manualmente por WhatsApp.')
            }
        } catch (err) {
            console.error('Error al compartir:', err)
            alert('No se pudo compartir. Intenta descargar la imagen.')
        }
    }

    const resetForm = () => {
        setTicket(null)
        setNombre('')
        setQrImage('')
    }

    const isVip = tipoInvitacion === 'doble'

    return (
        <div className="min-h-screen bg-slate-900 p-4 font-sans">
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
                        <form onSubmit={handleGenerate} className="space-y-5">

                            {/* Selector tipo de invitación */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Invitación</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setTipoInvitacion('doble')}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${tipoInvitacion === 'doble'
                                            ? 'border-amber-500 bg-amber-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">⭐</div>
                                        <div className="font-bold text-gray-800 text-sm">VIP / Invitado</div>
                                        <div className="text-xs text-gray-500 mt-0.5">Titular + 1 acompañante</div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setTipoInvitacion('staff')}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${tipoInvitacion === 'staff'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">🎫</div>
                                        <div className="font-bold text-gray-800 text-sm">Staff / Admin</div>
                                        <div className="text-xs text-gray-500 mt-0.5">Acceso individual</div>
                                    </button>
                                </div>
                            </div>

                            {/* Evento */}
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

                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {isVip ? 'Nombre del Invitado' : 'Nombre del Personal'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-lg text-black bg-white focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder={isVip ? 'Ej: María Pérez' : 'Ej: Juan González'}
                                />
                            </div>

                            {/* Info según tipo */}
                            {isVip ? (
                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                    <p className="text-amber-800 text-sm font-medium">⭐ Invitación VIP — Admisión doble (titular + 1 acompañante)</p>
                                </div>
                            ) : (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="text-blue-800 text-sm font-medium">🎫 Invitación Staff — Acceso individual</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full text-white py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50 ${isVip ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {loading ? 'Generando...' : `Generar Invitación ${isVip ? 'VIP' : 'Staff'}`}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        {/* Vista previa del ticket */}
                        <div
                            ref={ticketRef}
                            className={`text-white p-8 rounded-none mx-auto shadow-2xl relative overflow-hidden flex flex-col items-center text-center ${ticket.tipo === 'doble' ? 'bg-zinc-900' : 'bg-slate-900'}`}
                            style={{ width: '100%', aspectRatio: '9/16', maxWidth: '350px' }}
                        >
                            {/* Línea superior */}
                            <div className={`absolute top-0 left-0 w-full h-2 ${ticket.tipo === 'doble'
                                ? 'bg-gradient-to-r from-amber-500 via-red-500 to-amber-500'
                                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500'
                                }`}></div>

                            <div className="mt-8 mb-4">
                                <h3 className={`tracking-widest text-sm font-bold uppercase ${ticket.tipo === 'doble' ? 'text-amber-500' : 'text-blue-400'}`}>
                                    Parque Hípico
                                </h3>
                                <h1 className="text-xl font-serif italic mt-1 leading-tight">{ticket.evento}</h1>
                            </div>

                            <div className="my-auto w-full">
                                <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                                    {ticket.tipo === 'doble' ? 'Invitación Oficial' : 'Personal Autorizado'}
                                </p>
                                <h2 className="text-3xl font-bold text-white mb-6 break-words leading-tight">{ticket.nombre}</h2>

                                <div className="bg-white p-3 rounded-lg inline-block shadow-lg mb-6">
                                    {qrImage && <img src={qrImage} alt="QR Ticket" className="w-48 h-48" />}
                                </div>

                                {ticket.tipo === 'doble' ? (
                                    <>
                                        <div className="inline-block bg-amber-600 text-black px-4 py-1 rounded-full font-bold text-sm mb-2">
                                            ADMISIÓN DOBLE
                                        </div>
                                        <p className="text-gray-400 text-xs">Válido para titular + 1 acompañante</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full font-bold text-sm mb-2">
                                            PERSONAL AUTORIZADO
                                        </div>
                                        <p className="text-gray-400 text-xs">Acceso individual</p>
                                    </>
                                )}
                            </div>

                            <div className="mb-8 opacity-50 text-[10px] uppercase tracking-widest">
                                Prohibida su venta • Uso exclusivo Staff
                                <br />ID: {ticket.codigo.slice(0, 15)}...
                            </div>
                        </div>

                        {/* Botones */}
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
