'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Html5Qrcode } from 'html5-qrcode'
import Link from 'next/link'

export default function ScanPage() {
    const [scanResult, setScanResult] = useState<any>(null)
    const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error' | 'warning'>('idle')
    const [message, setMessage] = useState('')
    const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const scannerRef = useRef<Html5Qrcode | null>(null)

    const startScanner = async () => {
        try {
            setCameraError(null)
            setIsScanning(true)

            // Solicitar permisos explícitamente primero
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            stream.getTracks().forEach(track => track.stop()) // Solo para probar permisos

            const scanner = new Html5Qrcode("reader")
            scannerRef.current = scanner

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                onScanSuccess,
                () => { } // Silenciar errores de escaneo
            )
        } catch (err: any) {
            console.error('Camera error:', err)
            setIsScanning(false)

            if (err.name === 'NotAllowedError') {
                setCameraError('⚠️ Permiso de cámara denegado. Por favor, permite el acceso a la cámara en la configuración de tu navegador.')
            } else if (err.name === 'NotFoundError') {
                setCameraError('⚠️ No se encontró ninguna cámara en este dispositivo.')
            } else {
                setCameraError(`⚠️ Error al iniciar la cámara: ${err.message || 'Error desconocido'}`)
            }
        }
    }

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop()
                scannerRef.current = null
            } catch (e) {
                console.log('Error stopping scanner:', e)
            }
        }
        setIsScanning(false)
    }

    useEffect(() => {
        return () => {
            stopScanner()
        }
    }, [])

    const onScanSuccess = async (decodedText: string) => {
        if (decodedText === lastScannedCode) return
        setLastScannedCode(decodedText)

        setScanStatus('idle')
        setMessage('Procesando...')

        try {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('codigo_qr', decodedText)
                .single()

            if (error || !data) {
                setScanStatus('error')
                setMessage('❌ TICKET NO ENCONTRADO')
                return
            }

            setScanResult(data)

            if (data.estado === 'usado') {
                setScanStatus('warning')
                const fechaUso = new Date(data.created_at || Date.now()).toLocaleTimeString()
                setMessage(`⚠️ TICKET YA USADO`)
            } else {
                // Solo actualizar estado (updated_at no existe en la tabla)
                const { error: updateError } = await supabase
                    .from('tickets')
                    .update({ estado: 'usado' })
                    .eq('id', data.id)

                if (updateError) {
                    console.error('Update error:', updateError)
                    setScanStatus('error')
                    setMessage('Error al actualizar ticket')
                    return
                }

                setScanStatus('success')
                setMessage('✅ ACCESO CONCEDIDO')
            }

        } catch (err) {
            console.error(err)
            setScanStatus('error')
            setMessage('Error de conexión')
        }

        setTimeout(() => setLastScannedCode(null), 3000)
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

                {/* Botón para iniciar cámara */}
                {!isScanning && !cameraError && (
                    <div className="text-center">
                        <button
                            onClick={startScanner}
                            className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-500 transition-all"
                        >
                            📷 Iniciar Cámara
                        </button>
                        <p className="text-gray-500 mt-4 text-sm">
                            Presiona para activar la cámara y escanear códigos QR
                        </p>
                    </div>
                )}

                {/* Error de cámara */}
                {cameraError && (
                    <div className="bg-red-900/50 border border-red-500 rounded-xl p-6 text-center max-w-sm">
                        <p className="text-red-300 mb-4">{cameraError}</p>
                        <button
                            onClick={startScanner}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold"
                        >
                            🔄 Reintentar
                        </button>
                    </div>
                )}

                {/* Contenedor del scanner */}
                <div
                    id="reader"
                    className={`w-full max-w-sm bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 ${!isScanning ? 'hidden' : ''}`}
                    style={{ minHeight: '300px' }}
                ></div>

                {/* Botón para detener */}
                {isScanning && scanStatus === 'idle' && (
                    <button
                        onClick={stopScanner}
                        className="bg-gray-700 text-white px-6 py-2 rounded-lg text-sm"
                    >
                        Detener Cámara
                    </button>
                )}

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

                                {scanResult.estado === 'cortesia' && (
                                    <div className="bg-amber-500 text-black px-3 py-1 rounded-full inline-block text-sm font-bold mt-2">
                                        CORTESÍA DOBLE
                                    </div>
                                )}
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

                {isScanning && scanStatus === 'idle' && (
                    <div className="text-center text-gray-500 mt-4">
                        <p>Apunta la cámara al código QR del visitante.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
