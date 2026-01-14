'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
    const router = useRouter()
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUserEmail(user.email || null)
            setLoading(false)
        }
        checkUser()
    }, [router])

    if (loading) return <div className="p-10 text-center">Cargando panel...</div>

    const isGuard = userEmail?.toLowerCase()?.includes('guardia')

    // Ejemplo: staff@parque.cl -> NO es guardia
    // guardia@parque.cl -> ES guardia

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
            <header className="flex justify-between items-center mb-10 border-b border-gray-700 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-amber-500">Parque Hípico</h1>
                    <p className="text-gray-400 text-sm">
                        {isGuard ? '👮 Panel de Seguridad' : '🎩 Panel de Staff'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{userEmail}</p>
                </div>
                <button
                    onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
                    className="text-red-400 hover:text-white text-sm font-semibold border border-red-900 bg-red-950/30 px-3 py-1 rounded"
                >
                    Salir
                </button>
            </header>

            <main className="grid gap-6 max-w-md mx-auto">

                {/* 1. VALIDACIÓN (Para TODOS) */}
                <Link href="/admin/scan" className="group relative overflow-hidden bg-green-600 p-6 rounded-2xl shadow-xl transition-transform hover:scale-105">
                    <div className="flex items-center gap-4 z-10 relative">
                        <span className="text-4xl">📷</span>
                        <div>
                            <h2 className="text-xl font-bold">Escanear QR</h2>
                            <p className="text-green-200 text-sm">Validar entradas con cámara</p>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/lista" className="group relative overflow-hidden bg-blue-600 p-6 rounded-2xl shadow-xl transition-transform hover:scale-105">
                    <div className="flex items-center gap-4 z-10 relative">
                        <span className="text-4xl">📋</span>
                        <div>
                            <h2 className="text-xl font-bold">Lista de Invitados</h2>
                            <p className="text-blue-200 text-sm">Buscar por nombre manualmente</p>
                        </div>
                    </div>
                </Link>

                {/* 2. GESTIÓN (Solo Staff) */}
                {!isGuard && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Gestión</p>

                        <Link href="/admin/dashboard" className="group relative overflow-hidden bg-amber-600 p-6 rounded-2xl shadow-xl mb-4 block transition-transform hover:scale-105">
                            <div className="flex items-center gap-4 z-10 relative">
                                <span className="text-4xl">📊</span>
                                <div>
                                    <h2 className="text-xl font-bold">Dashboard de Ventas</h2>
                                    <p className="text-amber-200 text-sm">Ver todos los tickets y estadísticas</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/admin/invitaciones" className="group relative overflow-hidden bg-zinc-800 p-6 rounded-2xl shadow-lg border border-zinc-700 transition-transform hover:bg-zinc-700 block">
                            <div className="flex items-center gap-4 z-10 relative">
                                <span className="text-4xl">🎟️</span>
                                <div>
                                    <h2 className="text-xl font-bold text-amber-500">Crear Invitación</h2>
                                    <p className="text-gray-400 text-sm">Generar cortesías para staff</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    )
}
