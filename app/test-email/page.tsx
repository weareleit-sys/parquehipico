'use client';

import { useState } from 'react';
import QRCode from 'qrcode';

export default function TestEmailPage() {
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    const handleSendTest = async () => {
        // Validar campos
        if (!email || !nombre) {
            setMessage({
                type: 'error',
                text: 'Por favor completa todos los campos',
            });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            // Ahora solo enviamos el CÓDIGO (texto), no la imagen. El correo hará la magia.
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    nombre: nombre,
                    qrCode: `TICKET-${Date.now()}`, // Enviamos solo el texto del ticket
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({
                    type: 'success',
                    text: `✅ Email enviado exitosamente a ${email}`,
                });
                // Limpiar formulario
                setEmail('');
                setNombre('');
            } else {
                setMessage({
                    type: 'error',
                    text: `❌ Error: ${data.error || 'No se pudo enviar el email'}`,
                });
            }
        } catch (error: any) {
            console.error('Error:', error);
            setMessage({
                type: 'error',
                text: `❌ Error de conexión: ${error.message}`,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>🧪 Prueba de Envío de Entradas</h1>
                <p style={styles.subtitle}>
                    Sistema de entradas por correo - Parque Hípico La Montaña
                </p>

                <div style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nombre del invitado:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <button
                        onClick={handleSendTest}
                        disabled={loading}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {}),
                        }}
                    >
                        {loading ? '⏳ Enviando...' : '📧 Enviar Prueba'}
                    </button>

                    {message && (
                        <div
                            style={{
                                ...styles.message,
                                ...(message.type === 'success'
                                    ? styles.messageSuccess
                                    : styles.messageError),
                            }}
                        >
                            {message.text}
                        </div>
                    )}
                </div>

                <div style={styles.info}>
                    <h3 style={styles.infoTitle}>ℹ️ Información</h3>
                    <ul style={styles.infoList}>
                        <li>Se generará un QR de prueba automáticamente</li>
                        <li>El correo será enviado usando Resend</li>
                        <li>Asegúrate de tener configurada RESEND_API_KEY en .env</li>
                        <li>Revisa tu bandeja de entrada (y spam) después de enviar</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    } as React.CSSProperties,
    card: {
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    } as React.CSSProperties,
    title: {
        color: '#f8fafc',
        fontSize: '32px',
        marginBottom: '8px',
        textAlign: 'center',
    } as React.CSSProperties,
    subtitle: {
        color: '#94a3b8',
        fontSize: '16px',
        textAlign: 'center',
        marginBottom: '32px',
    } as React.CSSProperties,
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    } as React.CSSProperties,
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    } as React.CSSProperties,
    label: {
        color: '#cbd5e1',
        fontSize: '14px',
        fontWeight: '500',
    } as React.CSSProperties,
    input: {
        backgroundColor: '#0f172a',
        border: '2px solid #334155',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '16px',
        color: '#f8fafc',
        outline: 'none',
        transition: 'border-color 0.2s',
    } as React.CSSProperties,
    button: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '14px 24px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginTop: '8px',
    } as React.CSSProperties,
    buttonDisabled: {
        backgroundColor: '#475569',
        cursor: 'not-allowed',
        opacity: 0.6,
    } as React.CSSProperties,
    message: {
        padding: '16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
    } as React.CSSProperties,
    messageSuccess: {
        backgroundColor: '#065f46',
        color: '#d1fae5',
        border: '1px solid #10b981',
    } as React.CSSProperties,
    messageError: {
        backgroundColor: '#7f1d1d',
        color: '#fecaca',
        border: '1px solid #ef4444',
    } as React.CSSProperties,
    info: {
        marginTop: '32px',
        padding: '20px',
        backgroundColor: '#334155',
        borderRadius: '8px',
    } as React.CSSProperties,
    infoTitle: {
        color: '#f8fafc',
        fontSize: '18px',
        marginBottom: '12px',
    } as React.CSSProperties,
    infoList: {
        color: '#cbd5e1',
        fontSize: '14px',
        lineHeight: '24px',
        paddingLeft: '20px',
    } as React.CSSProperties,
};
