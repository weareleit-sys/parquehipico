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
    const [cameraError, setCameraError] = useState<string | null>(null)
    const [isScanning, setIsScanning] = useState(false)

    const scannerRef = useRef<Html5Qrcode | null>(null)
    const isProcessingRef = useRef(false) // Usar ref para tracking sincrónico
    const lastCodeRef = useRef<string | null>(null)

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

    const startScanner = async () => {
        try {
            setCameraError(null)
            setIsScanning(true)
            isProcessingRef.current = false
            lastCodeRef.current = null

            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            stream.getTracks().forEach(track => track.stop())

            const scanner = new Html5Qrcode("reader")
            scannerRef.current = scanner

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 5, // Reducir FPS para menos callbacks
                    qrbox: { width: 250, height: 250 }
                },
                onScanSuccess,
                () => { }
            )
        } catch (err: any) {
            console.error('Camera error:', err)
            setIsScanning(false)

            if (err.name === 'NotAllowedError') {
                setCameraError('⚠️ Permiso de cámara denegado. Por favor, permite el acceso.')
            } else if (err.name === 'NotFoundError') {
                setCameraError('⚠️ No se encontró ninguna cámara.')
            } else {
                setCameraError(`⚠️ Error: ${err.message || 'Error desconocido'}`)
            }
        }
    }

    useEffect(() => {
        return () => {
            stopScanner()
        }
    }, [])

    const onScanSuccess = async (decodedText: string) => {
        // BLOQUEO SINCRÓNICO - usar refs, no state
        if (isProcessingRef.current) {
            console.log('[SCAN] Ya procesando, ignorando:', decodedText)
            return
        }
        if (decodedText === lastCodeRef.current) {
            console.log('[SCAN] Código repetido, ignorando:', decodedText)
            return
        }

        // Marcar como procesando INMEDIATAMENTE (sincrónico)
        isProcessingRef.current = true
        lastCodeRef.current = decodedText

        console.log('[SCAN] Procesando código:', decodedText)

        // Detener el scanner para evitar más callbacks
        await stopScanner()

        setScanResult(null)
        setScanStatus('idle')
        setMessage('Procesando...')

        try {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('codigo_qr', decodedText)
                .single()

            console.log('[SCAN] Ticket encontrado, estado:', data?.estado)

            if (error || !data) {
                setScanStatus('error')
                setMessage('❌ TICKET NO ENCONTRADO')
                isProcessingRef.current = false
                return
            }

            setScanResult(data)

            if (data.estado === 'usado') {
                setScanStatus('warning')
                setMessage('⚠️ TICKET YA USADO')
            } else {
                const { error: updateError } = await supabase
                    .from('tickets')
                    .update({ estado: 'usado' })
                    .eq('id', data.id)

                if (updateError) {
                    console.error('[SCAN] Error en update:', updateError)
                    setScanStatus('error')
                    setMessage('Error al actualizar')
                    isProcessingRef.current = false
                    return
                }

                console.log('[SCAN] ✅ Actualizado correctamente')
                setScanStatus('success')
                setMessage('✅ ACCESO CONCEDIDO')
            }

        } catch (err) {
            console.error('[SCAN] Error:', err)
            setScanStatus('error')
            setMessage('Error de conexión')
        }

        isProcessingRef.current = false
    }

    const resetAndRescan = async () => {
        setScanResult(null)
        setScanStatus('idle')
        setMessage('')
        lastCodeRef.current = null
        isProcessingRef.current = false
        await startScanner()
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 font-sans flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <Link href="/admin" className="text-gray-400 hover:text-white">
                    ← Volver
                </Link>
                <h1 className="font-bold text-lg">Validación Accesos</h1>
            </div>

            <div className="flex-grow flex flex-col items-center justify-start gap-6">

                {!isScanning && scanStatus === 'idle' && !cameraError && (
                    <div className="text-center">
                        <button
                            onClick={startScanner}
                            className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-500 transition-all"
                        >
                            📷 Iniciar Cámara
                        </button>
                        <p className="text-gray-500 mt-4 text-sm">
                            Presiona para activar la cámara
                        </p>
                    </div>
                )}

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

                <div
                    id="reader"
                    className={`w-full max-w-sm bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 ${!isScanning ? 'hidden' : ''}`}
                    style={{ minHeight: '300px' }}
                ></div>

                {isScanning && scanStatus === 'idle' && (
                    <div className="text-center text-gray-500">
                        <p>Apunta la cámara al código QR</p>
                    </div>
                )}

                {scanStatus !== 'idle' && (
                    <div className={`w-full max-w-sm p-6 rounded-xl shadow-2xl text-center border-4 ${scanStatus === 'success' ? 'bg-green-600 border-green-400' :
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
                            onClick={resetAndRescan}
                            className="mt-6 bg-white text-black px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                        >
                            Escanear Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
