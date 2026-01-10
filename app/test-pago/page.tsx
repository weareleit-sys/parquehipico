'use client'
import { useState } from 'react'

export default function TestPagoPage() {
    const [loading, setLoading] = useState(false)
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')

    const handlePagar = async () => {
        if (!nombre || !email) return alert('Por favor llena tus datos');

        setLoading(true)
        // Guardamos datos temporalmente
        localStorage.setItem('ticket_nombre', nombre);
        localStorage.setItem('ticket_email', email);

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Entrada General',
                    price: 5000,
                    name: nombre,
                    email: email
                })
            })
            const data = await res.json()

            // 👇 Mostramos el error REAL que viene del servidor
            if (data.url) {
                window.location.href = data.url
            } else {
                console.error('Error del servidor:', data)
                alert(data.error || 'Error al procesar el pago')
            }
        } catch (error) {
            alert('Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white p-4">
            <div className="bg-gray-800 p-8 rounded-xl max-w-sm w-full space-y-4">
                <h1 className="text-2xl font-bold text-center">🎟️ Comprar Entrada</h1>
                <input
                    type="text" placeholder="Tu Nombre Completo"
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600"
                    onChange={e => setNombre(e.target.value)}
                />
                <input
                    type="email" placeholder="Tu Correo"
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600"
                    onChange={e => setEmail(e.target.value)}
                />
                <button
                    onClick={handlePagar} disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold"
                >
                    {loading ? 'Procesando...' : 'Ir a Pagar ($5.000)'}
                </button>
            </div>
        </div>
    )
}
