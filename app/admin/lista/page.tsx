'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

interface Invitacion {
    id: string
    created_at: string
    nombre_cliente: string
    evento: string
    codigo_qr: string
    estado: string
}

export default function GuestListPage() {
    const [invitaciones, setInvitaciones] = useState<Invitacion[]>([])
    const [filteredInvitaciones, setFilteredInvitaciones] = useState<Invitacion[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterEvento, setFilterEvento] = useState('todos')
    const [filterStatus, setFilterStatus] = useState('todos')

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        pendientes: 0,
        usados: 0
    })

    // Lista de eventos únicos
    const [eventos, setEventos] = useState<string[]>([])

    useEffect(() => {
        fetchInvitaciones()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [invitaciones, searchTerm, filterEvento, filterStatus])

    const fetchInvitaciones = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('estado', 'cortesia')
                .or('estado.eq.cortesia,estado.eq.usado')
                .order('created_at', { ascending: false })

            if (error) throw error

            if (data) {
                // Filtrar solo cortesías (invitaciones)
                const cortesias = data.filter(t => t.monto_pagado === 0 || t.estado === 'cortesia')
                setInvitaciones(cortesias)

                // Calcular stats
                const total = cortesias.length
                const pendientes = cortesias.filter(t => t.estado === 'cortesia').length
                const usados = cortesias.filter(t => t.estado === 'usado').length
                setStats({ total, pendientes, usados })

                // Obtener eventos únicos
                const eventosUnicos = [...new Set(cortesias.map(t => t.evento).filter(Boolean))]
                setEventos(eventosUnicos)
            }
        } catch (err) {
            console.error('Error fetching invitaciones:', err)
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let result = [...invitaciones]

        // Filtro por búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(t =>
                t.nombre_cliente?.toLowerCase().includes(term) ||
                t.codigo_qr?.toLowerCase().includes(term)
            )
        }

        // Filtro por evento
        if (filterEvento !== 'todos') {
            result = result.filter(t => t.evento === filterEvento)
        }

        // Filtro por estado
        if (filterStatus !== 'todos') {
            result = result.filter(t => t.estado === filterStatus)
        }

        setFilteredInvitaciones(result)
    }

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const markAsUsed = async (ticketId: string) => {
        if (!confirm('¿Marcar esta invitación como USADA (ya llegó)?')) return

        try {
            const { error } = await supabase
                .from('tickets')
                .update({ estado: 'usado' })
                .eq('id', ticketId)

            if (!error) {
                setInvitaciones(prev => prev.map(t =>
                    t.id === ticketId ? { ...t, estado: 'usado' } : t
                ))
            }
        } catch (err) {
            alert('Error al actualizar')
        }
    }

    const deleteInvitacion = async (ticketId: string, nombreCliente: string) => {
        if (!confirm(`¿Eliminar permanentemente la invitación de "${nombreCliente}"?`)) return

        try {
            const { error } = await supabase
                .from('tickets')
                .delete()
                .eq('id', ticketId)

            if (!error) {
                setInvitaciones(prev => prev.filter(t => t.id !== ticketId))
                alert('Invitación eliminada correctamente')
            }
        } catch (err) {
            alert('Error al eliminar')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Cargando invitaciones...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <Link href="/admin" className="text-slate-400 text-sm hover:text-white mb-2 inline-block">
                        ← Volver al Admin
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Lista de Invitados</h1>
                </div>
                <button
                    onClick={fetchInvitaciones}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 text-sm"
                >
                    🔄 Actualizar
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <p className="text-slate-400 text-sm">Total Invitados</p>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-amber-500/30">
                    <p className="text-slate-400 text-sm">Pendientes</p>
                    <p className="text-3xl font-bold text-amber-400">{stats.pendientes}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-green-500/30">
                    <p className="text-slate-400 text-sm">Ya Llegaron</p>
                    <p className="text-3xl font-bold text-green-400">{stats.usados}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o código QR..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-amber-500 outline-none"
                    />
                    <select
                        value={filterEvento}
                        onChange={(e) => setFilterEvento(e.target.value)}
                        className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
                    >
                        <option value="todos">Todos los eventos</option>
                        {eventos.map(ev => (
                            <option key={ev} value={ev}>{ev}</option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="cortesia">Pendientes</option>
                        <option value="usado">Ya llegaron</option>
                    </select>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                    Mostrando {filteredInvitaciones.length} de {invitaciones.length} invitaciones
                </p>
            </div>

            {/* Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Fecha</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Nombre</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase hidden md:table-cell">Evento</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase hidden lg:table-cell">Código QR</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Estado</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredInvitaciones.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                        No hay invitaciones para mostrar
                                    </td>
                                </tr>
                            ) : (
                                filteredInvitaciones.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-700/50">
                                        <td className="px-4 py-3 text-sm text-slate-300 whitespace-nowrap">
                                            {formatFecha(inv.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-white font-medium">{inv.nombre_cliente}</div>
                                            <div className="text-slate-400 text-xs md:hidden">{inv.evento || '-'}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-300 hidden md:table-cell">
                                            {inv.evento || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500 font-mono hidden lg:table-cell">
                                            {inv.codigo_qr?.slice(0, 20)}...
                                        </td>
                                        <td className="px-4 py-3">
                                            {inv.estado === 'usado' ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                                                    ✓ LLEGÓ
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                                    PENDIENTE
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                {inv.estado !== 'usado' && (
                                                    <button
                                                        onClick={() => markAsUsed(inv.id)}
                                                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-500"
                                                    >
                                                        MARCAR LLEGADA
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteInvitacion(inv.id, inv.nombre_cliente)}
                                                    className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-red-500"
                                                    title="Eliminar invitación"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
