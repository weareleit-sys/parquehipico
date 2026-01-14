'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef, Suspense } from 'react'

function CompraExitosaContent() {
    const searchParams = useSearchParams()
    const paymentId = searchParams.get('payment_id')
    const externalReference = searchParams.get('external_reference') // ← ID de la orden
    const [status, setStatus] = useState('Procesando tu entrada...')
    const processedRef = useRef(false)

    useEffect(() => {
        if (paymentId && externalReference && !processedRef.current) {
            processedRef.current = true;

            // Llamar al API para procesar el pago usando el external_reference
            fetch('/api/process-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payment_id: paymentId,
                    order_id: externalReference
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setStatus('✅ ¡Entradas generadas y enviadas a tu correo!');
                    } else {
                        console.error('Error API:', data);
                        setStatus('⚠️ Tu pago fue exitoso, pero hubo un error generando los tickets. Contáctanos.');
                    }
                })
                .catch((e) => {
                    console.error(e);
                    setStatus('❌ Error de conexión. Contáctanos con tu comprobante.');
                });
        } else if (paymentId && !externalReference) {
            // Fallback: intentar con localStorage (compatibilidad)
            const pendingOrderStr = localStorage.getItem('pending_order');
            if (pendingOrderStr) {
                const orderData = JSON.parse(pendingOrderStr);
                fetch('/api/register-ticket', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: orderData.email,
                        attendees: orderData.attendees,
                        payment_id: paymentId,
                        total: orderData.totalPrice || 0,
                        eventName: orderData.eventName
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            setStatus('✅ ¡Entradas generadas y enviadas a tu correo!');
                            localStorage.removeItem('pending_order');
                        } else {
                            setStatus('⚠️ Tu pago fue exitoso, pero hubo un error. Contáctanos.');
                        }
                    })
                    .catch(() => setStatus('❌ Error de conexión.'));
            } else {
                setStatus('⚠️ Pago recibido. Contáctanos para confirmar tus entradas.');
            }
        }
    }, [paymentId, externalReference])

    return (
        <div className="bg-green-800 p-8 rounded-2xl text-center max-w-md w-full border border-green-600">
            <div className="text-7xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">¡Pago Exitoso!</h1>
            <p className="text-yellow-200 font-bold mb-6 text-lg">{status}</p>
            <div className="bg-green-900/50 p-4 rounded-lg mb-6 text-sm text-white">
                <p className="opacity-75">ID de transacción:</p>
                <p className="font-mono font-bold text-lg">{paymentId || '---'}</p>
            </div>
            <Link href="/" className="bg-white text-green-900 font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition inline-block">
                Volver al Inicio
            </Link>
        </div>
    )
}

export default function CompraExitosaPage() {
    return (
        <div className="min-h-screen bg-green-900 flex flex-col items-center justify-center text-white p-4">
            <Suspense fallback={<div className="text-white">Cargando...</div>}>
                <CompraExitosaContent />
            </Suspense>
        </div>
    )
}
