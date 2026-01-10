'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Html5QrcodeScanner } from 'html5-qrcode'
import Link from 'next/link'

export default function ScanPage() {
    const [scanResult, setScanResult] = useState<any>(null) // Data del ticket
    const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error' | 'warning'>('idle')
    const [message, setMessage] = useState('')
    const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)
    const scannerRef = useRef<Html5QrcodeScanner | null>(null)

    // Sonidos (Opcional pero recomendado para feedback)
    const playSound = (type: 'success' | 'error') => {
        const audio = new Audio(type === 'success' ? '/sounds/beep-success.mp3' : '/sounds/beep-error.mp3') // Placeholder paths
        audio.play().catch(e => console.log('Audio play failed', e))
    }

    useEffect(() => {
        // Inicializar Scanner
        // Usamos un timeout pequeño para asegurar que el DOM esté listo
        const timer = setTimeout(() => {
            const scanner = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                    showTorchButtonIfSupported: true
                },
                /* verbose= */ false
            )

            scanner.render(onScanSuccess, onScanFailure)
            scannerRef.current = scanner
        }, 100)

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode scanner. ", error)
                })
            }
            clearTimeout(timer)
        }
    }, [])

    const onScanSuccess = async (decodedText: string) => {
        // Evitar procesar el mismo código muchas veces seguidas en milisegundos
        if (decodedText === lastScannedCode) return
        setLastScannedCode(decodedText)

        // Pausar visualmente para procesar
        setScanStatus('idle')
        setMessage('Procesando...')

        try {
            // 1. Buscar en BD
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('codigo_qr', decodedText)
                .single()

            if (error || !data) {
                setScanStatus('error')
                setMessage('❌ TICKET NO ENCONTRADO')
                playSound('error')
                return
            }

            setScanResult(data)

            // 2. Validar Estado
            if (data.estado === 'usado') {
                setScanStatus('warning')
                const fechaUso = new Date(data.updated_at || Date.now()).toLocaleTimeString()
                setMessage(`⚠️ TICKET YA USADO (A las ${fechaUso})`)
                playSound('error')
            } else {
                // 3. Marcar como USADO
                const { error: updateError } = await supabase
                    .from('tickets')
                    .update({
                        estado: 'usado',
                        updated_at: new Date().toISOString() // Importante para saber cuándo entró
                    })
                    .eq('id', data.id)

                if (updateError) {
                    setScanStatus('error')
                    setMessage('Error al actualizar ticket')
                    return
                }

                setScanStatus('success')
                setMessage('✅ ACCESO CONCEDIDO')
                playSound('success')
            }

        } catch (err) {
            console.error(err)
            setScanStatus('error')
            setMessage('Error de conexión')
        }

        // Limpiar el "last scanned" después de unos segundos para permitir escanearlo de nuevo si es necesario
        setTimeout(() => setLastScannedCode(null), 3000)
    }

    const onScanFailure = () => {
        // No hacer nada, es ruidoso
        // console.warn(`Code scan error = ${error}`)
    }

    const resetScan = () => {
        setScanResult(null)
        setScanStatus('idle')
        setMessage('')
        setLastScannedCode(null)
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 font-sans flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <Link href="/admin" className="text-gray-400 hover:text-white">
                    ← Volver
                </Link>
                <h1 className="font-bold text-lg">Validación Accesos</h1>
            </div>

            {/* Scanner Area */}
            <div className="flex-grow flex flex-col items-center justify-start gap-6">

                {/* Contenedor del scanner (Librería lo usa) */}
                <div id="reader" className="w-full max-w-sm bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700"></div>

                {/* Resultado */}
                {scanStatus !== 'idle' && (
                    <div className={`w-full max-w-sm p-6 rounded-xl shadow-2xl animate-fade-in text-center border-4 ${scanStatus === 'success' ? 'bg-green-600 border-green-400' :
                        scanStatus === 'warning' ? 'bg-yellow-600 border-yellow-400' :
                            'bg-red-600 border-red-400'
                        }`}>
                        <h2 className="text-3xl font-extrabold mb-2">{message}</h2>

                        {scanResult && (
                            <div className="bg-black/20 p-4 rounded-lg mt-4 text-left">
                                <p className="text-xs uppercase tracking-widest opacity-75">Asistente</p>
                                <p className="text-xl font-bold mb-2">{scanResult.nombre_cliente}</p>

                                <p className="text-xs uppercase tracking-widest opacity-75">Evento</p>
                                <p className="text-lg font-semibold mb-2">{scanResult.evento || 'General'}</p>

                                <p className="text-xs uppercase tracking-widest opacity-75">Tipo</p>
                                <p className="text-sm font-semibold">{scanResult.categoria || 'Entrada'}</p>
                            </div>
                        )}

                        <button
                            onClick={resetScan}
                            className="mt-6 bg-white text-black px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                        >
                            Escanear Siguiente
                        </button>
                    </div>
                )}

                {scanStatus === 'idle' && (
                    <div className="text-center text-gray-500 mt-10">
                        <p>Apunta la cámara al código QR del visitante.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
