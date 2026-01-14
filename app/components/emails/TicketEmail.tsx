import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface TicketEmailProps {
    tickets: { nombre: string; qr: string }[];
    eventName: string;
}

export default function TicketEmail({ tickets, eventName }: TicketEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Tus entradas para {eventName}</Preview>
            <Body style={{ backgroundColor: '#000000', fontFamily: 'sans-serif' }}>
                <Container style={{ margin: '0 auto', padding: '20px 0 48px', width: '580px', backgroundColor: '#1a1a1a', borderRadius: '10px' }}>
                    <Section style={{ backgroundColor: '#FFC107', padding: '20px', textAlign: 'center' }}>
                        <Text style={{ color: '#000', fontSize: '20px', fontWeight: 'bold', margin: '0' }}>PARQUE HÍPICO LA MONTAÑA</Text>
                    </Section>

                    <Section style={{ padding: '40px' }}>
                        <Heading style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: '0 0 20px', textAlign: 'center' }}>
                            ¡Todo listo para el evento!
                        </Heading>
                        <Text style={{ color: '#ccc', fontSize: '16px', textAlign: 'center', marginBottom: '30px' }}>
                            Aquí están tus entradas para <strong>{eventName}</strong>. Presenta cada código QR en el acceso.
                        </Text>

                        {/* Iteramos sobre los tickets */}
                        {tickets.map((ticket, index) => (
                            <Section key={index} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                                <Heading as="h3" style={{ color: '#000', fontSize: '18px', margin: '0 0 10px', textAlign: 'center', textTransform: 'uppercase' }}>
                                    Entrada #{index + 1}: {ticket.nombre}
                                </Heading>
                                <Img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ticket.qr)}`}
                                    width="200"
                                    height="200"
                                    alt={`QR de ${ticket.nombre}`}
                                    style={{ display: 'block', margin: '0 auto' }}
                                />
                            </Section>
                        ))}

                        <Text style={{ color: '#666', fontSize: '12px', marginTop: '30px', textAlign: 'center' }}>
                            Cada QR es único y válido para 1 ingreso. Prohibida su reventa.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
