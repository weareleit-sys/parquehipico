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
    tipo_invitacion: string | null
}

export default function GuestListPage() {
    const [invitaciones, setInvitaciones] = useState<Invitacion[]>([])
    const [filteredInvitaciones, setFilteredInvitaciones] = useState<Invitacion[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterEvento, setFilterEvento] = useState('todos')
    const [filterStatus, setFilterStatus] = useState('todos')
    const [filterTipo, setFilterTipo] = useState('todos')
    const [showClearConfirm, setShowClearConfirm] = useState(false)
    const [clearLoading, setClearLoading] = useState(false)

    const [stats, setStats] = useState({
        total: 0,
        pendientes: 0,
        usados: 0,
        vip: 0,
        staff: 0
    })

    const [eventos, setEventos] = useState<string[]>([])

    useEffect(() => {
        fetchInvitaciones()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [invitaciones, searchTerm, filterEvento, filterStatus, filterTipo])

    const fetchInvitaciones = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .in('estado', ['cortesia', 'usado'])
                .order('created_at', { ascending: false })

            if (error) throw error

            if (data) {
                const cortesias = data.filter(t => t.monto_pagado === 0 || t.estado === 'cortesia' || t.estado === 'usado')
                setInvitaciones(cortesias)

                const total = cortesias.length
                const pendientes = cortesias.filter(t => t.estado === 'cortesia').length
                const usados = cortesias.filter(t => t.estado === 'usado').length
                const vip = cortesias.filter(t => t.tipo_invitacion === 'doble').length
                const staff = cortesias.filter(t => t.tipo_invitacion === 'staff').length
                setStats({ total, pendientes, usados, vip, staff })

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

        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(t =>
                t.nombre_cliente?.toLowerCase().includes(term) ||
                t.codigo_qr?.toLowerCase().includes(term)
            )
        }

        if (filterEvento !== 'todos') {
            result = result.filter(t => t.evento === filterEvento)
        }

        if (filterStatus !== 'todos') {
            result = result.filter(t => t.estado === filterStatus)
        }

        if (filterTipo !== 'todos') {
            result = result.filter(t => (t.tipo_invitacion || 'doble') === filterTipo)
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

    // ── LIMPIAR TODOS LOS TICKETS ────────────────────────────────
    const clearAllTickets = async () => {
        setClearLoading(true)
        try {
            const { error } = await supabase
                .from('tickets')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000') // trick para borrar todos

            if (error) throw error

            setInvitaciones([])
            setStats({ total: 0, pendientes: 0, usados: 0, vip: 0, staff: 0 })
            setShowClearConfirm(false)
            alert('✅ Todos los registros han sido eliminados. ¡Listos para el próximo evento!')
        } catch (err: any) {
            alert('Error al limpiar: ' + err.message)
        } finally {
            setClearLoading(false)
        }
    }

    // ── DESCARGA OFFLINE ─────────────────────────────────────────
    const downloadOfflineList = () => {
        const listaData = JSON.stringify(invitaciones.map(inv => ({
            nombre: inv.nombre_cliente,
            evento: inv.evento || 'General',
            tipo: inv.tipo_invitacion === 'staff' ? 'STAFF' : 'VIP',
            estado: inv.estado === 'usado' ? 'LLEGÓ' : 'PENDIENTE',
            codigo: inv.codigo_qr
        })))

        const fecha = new Date().toLocaleDateString('es-CL')

        const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lista Offline — Parque Hípico</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, sans-serif; background: #0f172a; color: #fff; padding: 16px; }
  h1 { font-size: 20px; font-weight: bold; margin-bottom: 4px; }
  p.sub { font-size: 12px; color: #94a3b8; margin-bottom: 16px; }
  input {
    width: 100%; padding: 12px 16px; border-radius: 12px;
    border: 1px solid #334155; background: #1e293b; color: #fff;
    font-size: 16px; margin-bottom: 12px; outline: none;
  }
  input:focus { border-color: #f59e0b; }
  #count { font-size: 13px; color: #64748b; margin-bottom: 8px; }
  .card {
    background: #1e293b; border-radius: 12px; padding: 14px 16px;
    margin-bottom: 10px; border-left: 4px solid #334155;
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .card.vip { border-left-color: #f59e0b; }
  .card.staff { border-left-color: #3b82f6; }
  .card.usado { opacity: 0.55; }
  .nombre { font-weight: bold; font-size: 16px; }
  .meta { font-size: 12px; color: #94a3b8; margin-top: 4px; }
  .badges { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .badge {
    font-size: 11px; font-weight: bold; padding: 3px 10px;
    border-radius: 99px;
  }
  .badge-vip { background: #92400e; color: #fde68a; }
  .badge-staff { background: #1e3a8a; color: #bfdbfe; }
  .badge-ok { background: #166534; color: #bbf7d0; }
  .badge-pend { background: #78350f; color: #fef3c7; }
  #noResults { text-align: center; color: #475569; padding: 40px 0; font-size: 14px; }
</style>
</head>
<body>
<h1>🐴 Parque Hípico</h1>
<p class="sub">Lista offline generada el ${fecha} · ${invitaciones.length} invitados</p>
<input type="text" id="search" placeholder="Buscar por nombre..." oninput="buscar()" autocomplete="off" />
<div id="count"></div>
<div id="lista"></div>
<div id="noResults" style="display:none">No se encontraron resultados</div>

<script>
const datos = ${listaData};

function buscar() {
  const q = document.getElementById('search').value.toLowerCase().trim();
  const filtrado = q ? datos.filter(d => d.nombre.toLowerCase().includes(q)) : datos;
  renderizar(filtrado);
}

function renderizar(arr) {
  const lista = document.getElementById('lista');
  const countEl = document.getElementById('count');
  const noRes = document.getElementById('noResults');
  countEl.textContent = arr.length + ' invitado(s) encontrado(s)';
  noRes.style.display = arr.length === 0 ? 'block' : 'none';
  lista.innerHTML = arr.map(d => {
    const esVip = d.tipo === 'VIP';
    const llego = d.estado === 'LLEGÓ';
    return \`<div class="card \${esVip ? 'vip' : 'staff'} \${llego ? 'usado' : ''}">
      <div>
        <div class="nombre">\${d.nombre}</div>
        <div class="meta">\${d.evento}</div>
      </div>
      <div class="badges">
        <span class="badge \${esVip ? 'badge-vip' : 'badge-staff'}">\${d.tipo}</span>
        <span class="badge \${llego ? 'badge-ok' : 'badge-pend'}">\${d.estado}</span>
      </div>
    </div>\`;
  }).join('');
}

renderizar(datos);
document.getElementById('search').focus();
<\/script>
</body>
</html>`

        const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `lista-offline-parquehipico.html`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
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

            {/* Modal confirmación limpieza */}
            {showClearConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-red-500/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="text-4xl text-center mb-3">🗑️</div>
                        <h2 className="text-xl font-bold text-white text-center mb-2">¿Limpiar todos los registros?</h2>
                        <p className="text-slate-400 text-sm text-center mb-6">
                            Se eliminarán <strong className="text-red-400">{stats.total} invitaciones</strong> de forma permanente. Esta acción no se puede deshacer.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="bg-slate-700 text-white py-3 rounded-xl font-semibold hover:bg-slate-600"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={clearAllTickets}
                                disabled={clearLoading}
                                className="bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50"
                            >
                                {clearLoading ? 'Borrando...' : 'Sí, Limpiar Todo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <Link href="/admin" className="text-slate-400 text-sm hover:text-white mb-2 inline-block">
                        ← Volver al Admin
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Lista de Invitados</h1>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={downloadOfflineList}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 text-sm font-semibold flex items-center gap-1"
                    >
                        📥 Lista Offline
                    </button>
                    <button
                        onClick={fetchInvitaciones}
                        className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 text-sm"
                    >
                        🔄 Actualizar
                    </button>
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        className="bg-red-600/80 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-semibold"
                    >
                        🗑️ Limpiar Evento
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 col-span-1">
                    <p className="text-slate-400 text-xs">Total</p>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-amber-500/30">
                    <p className="text-slate-400 text-xs">Pendientes</p>
                    <p className="text-3xl font-bold text-amber-400">{stats.pendientes}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-green-500/30">
                    <p className="text-slate-400 text-xs">Ya Llegaron</p>
                    <p className="text-3xl font-bold text-green-400">{stats.usados}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-yellow-500/30">
                    <p className="text-slate-400 text-xs">VIP (doble)</p>
                    <p className="text-3xl font-bold text-yellow-400">{stats.vip}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-blue-500/30">
                    <p className="text-slate-400 text-xs">Staff</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.staff}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o código QR..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-amber-500 outline-none"
                    />
                    <select
                        value={filterTipo}
                        onChange={(e) => setFilterTipo(e.target.value)}
                        className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
                    >
                        <option value="todos">Todos los tipos</option>
                        <option value="doble">⭐ VIP (+1)</option>
                        <option value="staff">🎫 Staff</option>
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
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase hidden md:table-cell">Tipo</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase hidden md:table-cell">Evento</th>
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
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            {inv.tipo_invitacion === 'staff' ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                    🎫 STAFF
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                                    ⭐ VIP
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-300 hidden md:table-cell">
                                            {inv.evento || '-'}
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
                                                        LLEGÓ
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
