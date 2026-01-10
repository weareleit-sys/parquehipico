'use client'
import { useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import Link from 'next/link'

export default function GuestListPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [searching, setSearching] = useState(false)
    const [updating, setUpdating] = useState<string | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchTerm.trim()) return

        setSearching(true)
        setResults([])

        try {
            // Buscar por nombre (case insensitive ilike) O por ID parcial
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .or(`nombre_cliente.ilike.%${searchTerm}%,codigo_qr.ilike.%${searchTerm}%`)
                .order('created_at', { ascending: false })
                .limit(20)

            if (data) setResults(data)

        } catch (err) {
            console.error(err)
        } finally {
            setSearching(false)
        }
    }

    const markAsUsed = async (ticketId: string) => {
        if (!confirm('¿Marcar manualmente como USADO?')) return

        setUpdating(ticketId)
        try {
            const { error } = await supabase
                .from('tickets')
                .update({
                    estado: 'usado',
                    updated_at: new Date().toISOString()
                })
                .eq('id', ticketId)

            if (!error) {
                // Actualizar localmente
                setResults(prev => prev.map(t =>
                    t.id === ticketId ? { ...t, estado: 'usado' } : t
                ))
            }
        } catch (err) {
            alert('Error al actualizar')
        } finally {
            setUpdating(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-900">
            <nav className="flex justify-between items-center mb-6">
                <Link href="/admin" className="font-semibold text-gray-600">← Volver</Link>
                <h1 className="font-bold text-xl">Lista de Invitados</h1>
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por Nombre o Código..."
                    className="flex-1 p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    autoFocus
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-md active:bg-blue-700"
                >
                    {searching ? '...' : 'Buscar'}
                </button>
            </form>

            <div className="space-y-4">
                {results.map(ticket => (
                    <div key={ticket.id} className={`p-4 rounded-xl border flex justify-between items-center shadow-sm ${ticket.estado === 'usado' ? 'bg-gray-100 border-gray-200 opacity-75' : 'bg-white border-green-100'
                        }`}>
                        <div>
                            <h3 className="font-bold text-lg">{ticket.nombre_cliente}</h3>
                            <p className="text-sm text-gray-500">{ticket.evento || 'Evento General'}</p>
                            <p className="text-xs text-gray-400 mt-1 font-mono">{ticket.codigo_qr}</p>
                        </div>

                        <div>
                            {ticket.estado === 'usado' ? (
                                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">
                                    USADO
                                </span>
                            ) : (
                                <button
                                    onClick={() => markAsUsed(ticket.id)}
                                    disabled={!!updating}
                                    className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg shadow hover:bg-green-600"
                                >
                                    {updating === ticket.id ? '...' : 'MARCAR'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {!searching && results.length === 0 && searchTerm && (
                    <div className="text-center text-gray-500 mt-10">
                        No se encontraron resultados
                    </div>
                )}
            </div>
        </div>
    )
}
