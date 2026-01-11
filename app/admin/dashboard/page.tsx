'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

interface Ticket {
    id: string
    created_at: string
    payment_id: string
    nombre_cliente: string
    email_cliente: string
    monto_pagado: number
    estado: string
    codigo_qr: string
    evento: string
}

export default function DashboardPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('todos')
    const [filterEvento, setFilterEvento] = useState('todos')

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        pagados: 0,
        usados: 0,
        ingresos: 0
    })

    // Lista de eventos únicos
    const [eventos, setEventos] = useState<string[]>([])

    useEffect(() => {
        fetchTickets()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [tickets, searchTerm, filterStatus, filterEvento])

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            if (data) {
                setTickets(data)

                // Calcular stats
                const total = data.length
                const pagados = data.filter(t => t.estado === 'pagado').length
                const usados = data.filter(t => t.estado === 'usado').length
                const ingresos = data.reduce((sum, t) => sum + (t.monto_pagado || 0), 0)
                setStats({ total, pagados, usados, ingresos })

                // Obtener eventos únicos
                const eventosUnicos = [...new Set(data.map(t => t.evento).filter(Boolean))]
                setEventos(eventosUnicos)
            }
        } catch (err) {
            console.error('Error fetching tickets:', err)
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let result = [...tickets]

        // Filtro por búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(t =>
                t.nombre_cliente?.toLowerCase().includes(term) ||
                t.email_cliente?.toLowerCase().includes(term) ||
                t.payment_id?.toLowerCase().includes(term)
            )
        }

        // Filtro por estado
        if (filterStatus !== 'todos') {
            result = result.filter(t => t.estado === filterStatus)
        }

        // Filtro por evento
        if (filterEvento !== 'todos') {
            result = result.filter(t => t.evento === filterEvento)
        }

        setFilteredTickets(result)
    }

    const formatMonto = (monto: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(monto || 0)
    }

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const markAsUsed = async (ticketId: string) => {
        if (!confirm('¿Marcar este ticket como USADO?')) return

        try {
            const { error } = await supabase
                .from('tickets')
                .update({ estado: 'usado' })
                .eq('id', ticketId)

            if (!error) {
                setTickets(prev => prev.map(t =>
                    t.id === ticketId ? { ...t, estado: 'usado' } : t
                ))
            }
        } catch (err) {
            alert('Error al actualizar')
        }
    }

    const exportCSV = () => {
        const headers = ['Fecha', 'Cliente', 'Email', 'Evento', 'Monto', 'Estado', 'Payment ID', 'Código QR']
        const rows = filteredTickets.map(t => [
            formatFecha(t.created_at),
            t.nombre_cliente,
            t.email_cliente,
            t.evento || '',
            t.monto_pagado || 0,
            t.estado,
            t.payment_id || '',
            t.codigo_qr || ''
        ])

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `tickets_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Cargando...</div>
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
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard de Tickets</h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchTickets}
                        className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 text-sm"
                    >
                        🔄 Actualizar
                    </button>
                    <button
                        onClick={exportCSV}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 text-sm"
                    >
                        📥 Exportar CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <p className="text-slate-400 text-sm">Total Tickets</p>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-green-500/30">
                    <p className="text-slate-400 text-sm">Pendientes</p>
                    <p className="text-3xl font-bold text-green-400">{stats.pagados}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm">Usados</p>
                    <p className="text-3xl font-bold text-slate-400">{stats.usados}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-amber-500/30">
                    <p className="text-slate-400 text-sm">Ingresos</p>
                    <p className="text-2xl font-bold text-amber-400">{formatMonto(stats.ingresos)}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o payment ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-amber-500 outline-none"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pagado">Pagados (sin usar)</option>
                        <option value="usado">Usados</option>
                    </select>
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
                </div>
                <p className="text-slate-400 text-sm mt-2">
                    Mostrando {filteredTickets.length} de {tickets.length} tickets
                </p>
            </div>

            {/* Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Fecha</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Cliente</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase hidden md:table-cell">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase hidden lg:table-cell">Evento</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Monto</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Estado</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase hidden xl:table-cell">Payment ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredTickets.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                                        No hay tickets para mostrar
                                    </td>
                                </tr>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-slate-700/50">
                                        <td className="px-4 py-3 text-sm text-slate-300 whitespace-nowrap">
                                            {formatFecha(ticket.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-white font-medium">{ticket.nombre_cliente}</div>
                                            <div className="text-slate-400 text-xs md:hidden">{ticket.email_cliente}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-300 hidden md:table-cell">
                                            {ticket.email_cliente}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-300 hidden lg:table-cell">
                                            {ticket.evento || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-amber-400">
                                            {formatMonto(ticket.monto_pagado)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {ticket.estado === 'usado' ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-600 text-slate-300">
                                                    USADO
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                                                    PAGADO
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500 font-mono hidden xl:table-cell">
                                            {ticket.payment_id || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {ticket.estado !== 'usado' && (
                                                <button
                                                    onClick={() => markAsUsed(ticket.id)}
                                                    className="bg-amber-500 text-black px-3 py-1 rounded text-xs font-bold hover:bg-amber-400"
                                                >
                                                    MARCAR
                                                </button>
                                            )}
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
