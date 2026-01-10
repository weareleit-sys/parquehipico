import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Img,
    Hr,
} from '@react-email/components';

interface TicketEmailProps {
    nombreInvitado: string;
    nombreEvento?: string;
    qrCode: string; // base64 dataURL
}

export default function TicketEmail({
    nombreInvitado,
    nombreEvento = 'Parque Hípico',
    qrCode,
}: TicketEmailProps) {
    return (
        <Html>
            <Head />
            <Body style={styles.body}>
                <Container style={styles.container}>
                    {/* Header con Logo */}
                    <Section style={styles.header}>
                        <Text style={styles.logo}>🏇 PARQUE HÍPICO</Text>
                        <Text style={styles.sublogo}>La Montaña</Text>
                    </Section>

                    {/* Mensaje Principal */}
                    <Section style={styles.mainSection}>
                        <Text style={styles.greeting}>
                            Hola <strong>{nombreInvitado}</strong>,
                        </Text>
                        <Text style={styles.message}>
                            Tu entrada para <strong>{nombreEvento}</strong> está lista.
                        </Text>
                    </Section>

                    {/* QR Code */}
                    <Section style={styles.qrSection}>
                        <Text style={styles.qrLabel}>Tu código QR de acceso:</Text>
                        <Img
                            src={qrCode}
                            alt="QR Code de Entrada"
                            style={styles.qrImage}
                        />
                    </Section>

                    {/* Instrucciones */}
                    <Section style={styles.instructionsSection}>
                        <Text style={styles.instructionsTitle}>
                            📱 Instrucciones de Uso
                        </Text>
                        <Text style={styles.instruction}>
                            • Presenta este QR en portería para ingresar al evento
                        </Text>
                        <Text style={styles.instruction}>
                            • Puedes mostrar el código desde tu celular o imprimirlo
                        </Text>
                        <Text style={styles.instruction}>
                            • Guarda este correo para acceder fácilmente a tu entrada
                        </Text>
                    </Section>

                    <Hr style={styles.divider} />

                    {/* Footer Legal */}
                    <Section style={styles.footer}>
                        <Text style={styles.footerText}>
                            Este es un pase personal e intransferible. El QR es único y solo puede ser usado una vez.
                        </Text>
                        <Text style={styles.footerText}>
                            © {new Date().getFullYear()} Parque Hípico La Montaña. Todos los derechos reservados.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const styles = {
    body: {
        backgroundColor: '#0f172a',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        margin: 0,
        padding: 0,
    },
    container: {
        backgroundColor: '#1e293b',
        margin: '0 auto',
        maxWidth: '600px',
        padding: '40px 20px',
        borderRadius: '12px',
    },
    header: {
        textAlign: 'center' as const,
        marginBottom: '30px',
    },
    logo: {
        color: '#f8fafc',
        fontSize: '32px',
        fontWeight: 'bold',
        margin: '0 0 8px 0',
        letterSpacing: '2px',
    },
    sublogo: {
        color: '#94a3b8',
        fontSize: '16px',
        margin: '0',
        fontStyle: 'italic',
    },
    mainSection: {
        padding: '20px 0',
    },
    greeting: {
        color: '#f8fafc',
        fontSize: '18px',
        lineHeight: '24px',
        margin: '0 0 12px 0',
    },
    message: {
        color: '#cbd5e1',
        fontSize: '16px',
        lineHeight: '22px',
        margin: '0',
    },
    qrSection: {
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        padding: '30px',
        textAlign: 'center' as const,
        margin: '30px 0',
        border: '2px solid #334155',
    },
    qrLabel: {
        color: '#f8fafc',
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '20px',
    },
    qrImage: {
        width: '280px',
        height: '280px',
        margin: '0 auto',
        display: 'block',
        backgroundColor: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
    },
    instructionsSection: {
        backgroundColor: '#334155',
        borderRadius: '8px',
        padding: '24px',
        marginTop: '30px',
    },
    instructionsTitle: {
        color: '#f8fafc',
        fontSize: '18px',
        fontWeight: '600',
        margin: '0 0 16px 0',
    },
    instruction: {
        color: '#cbd5e1',
        fontSize: '14px',
        lineHeight: '20px',
        margin: '8px 0',
    },
    divider: {
        borderColor: '#475569',
        margin: '30px 0',
    },
    footer: {
        textAlign: 'center' as const,
        paddingTop: '20px',
    },
    footerText: {
        color: '#64748b',
        fontSize: '12px',
        lineHeight: '18px',
        margin: '8px 0',
    },
};
