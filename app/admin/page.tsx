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

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="text-xl text-neutral-600">Cargando panel...</div>
            </div>
        )
    }

    const isGuard = userEmail?.toLowerCase()?.includes('guardia')

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
                                Parque Hípico La Montaña
                            </h1>
                            <p className="text-slate-300 mt-1 text-base">
                                {isGuard ? 'Panel de Seguridad' : 'Panel de Administración'}
                            </p>
                            <p className="text-sm text-slate-400 mt-1">{userEmail}</p>
                        </div>
                        <button
                            onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
                            className="px-6 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                {/* Validation Section - For Everyone */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-slate-600">
                        VALIDACIÓN DE ENTRADAS
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Scan QR */}
                        <Link
                            href="/admin/scan"
                            className="group bg-white border-2 border-neutral-200 rounded-xl p-8 hover:border-green-600 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start gap-5">
                                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-green-700 transition-colors">
                                        Escanear Código QR
                                    </h3>
                                    <p className="text-neutral-600 text-base leading-relaxed">
                                        Validar entradas escaneando el código QR con la cámara
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Guest List */}
                        <Link
                            href="/admin/lista"
                            className="group bg-white border-2 border-neutral-200 rounded-xl p-8 hover:border-blue-600 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start gap-5">
                                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-blue-700 transition-colors">
                                        Lista de Invitados
                                    </h3>
                                    <p className="text-neutral-600 text-base leading-relaxed">
                                        Consultar y gestionar la lista completa de invitados
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* Management Section - Staff Only */}
                {!isGuard && (
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-slate-600">
                            GESTIÓN Y REPORTES
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Sales Dashboard */}
                            <Link
                                href="/admin/dashboard"
                                className="group bg-white border-2 border-neutral-200 rounded-xl p-8 hover:border-amber-600 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-amber-700 transition-colors">
                                            Reporte de Ventas
                                        </h3>
                                        <p className="text-neutral-600 text-base leading-relaxed">
                                            Ver estadísticas, tickets vendidos e ingresos totales
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {/* Create Invitation */}
                            <Link
                                href="/admin/invitaciones"
                                className="group bg-white border-2 border-neutral-200 rounded-xl p-8 hover:border-emerald-600 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-emerald-700 transition-colors">
                                            Crear Invitación
                                        </h3>
                                        <p className="text-neutral-600 text-base leading-relaxed">
                                            Generar cortesías personalizadas para invitados especiales
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </section>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-16 border-t border-slate-700 bg-slate-800">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <p className="text-center text-sm text-slate-400">
                        © {new Date().getFullYear()} Parque Hípico La Montaña - Sistema de Gestión de Eventos
                    </p>
                </div>
            </footer>
        </div>
    )
}
