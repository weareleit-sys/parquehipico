import { eventos } from './data/eventos';
import EventoCard from './components/EventoCard';

export const metadata = {
    title: 'Eventos | Parque Hípico La Montaña',
    description: 'Descubre todos los eventos próximos en el Parque Hípico La Montaña. Compra tus entradas online.',
};

export default function EventosPage() {
    return (
        <main className="pt-20">
            {/* Hero de Eventos */}
            <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Todos los Eventos</h1>
                    <p className="text-xl mb-8">Compra tus entradas online y asegura tu lugar</p>
                </div>
            </section>

            {/* Listado de Eventos */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    {eventos.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {eventos.map(evento => (
                                <EventoCard key={evento.id} evento={evento} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-xl text-slate-600">No hay eventos programados en este momento</p>
                            <p className="text-slate-500 mt-2">Vuelve pronto para ver nuestros próximos eventos</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
