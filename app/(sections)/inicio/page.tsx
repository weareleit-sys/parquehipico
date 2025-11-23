import Hero from './components/Hero';
import GaleriaRecinto from './components/GaleriaRecinto';
import CalendarioEventos from './components/CalendarioEventos';

export const metadata = {
    title: 'Parque Hípico La Montaña | Centro de Eventos del Sur de Chile',
    description: 'El centro de eventos más versátil del sur de Chile. Capacidad para 5.000 personas, 3 hectáreas para festivales, ferias y carreras.',
};

export default function InicioPage() {
    return (
        <main>
            <Hero />
            <GaleriaRecinto />
            <CalendarioEventos />
        </main>
    );
}
