import { categorias } from './data/categorias';

export const metadata = {
    title: 'Únete | Parque Hípico La Montaña',
    description: 'Únete a los eventos del Parque Hípico La Montaña. Artistas, gastronomía, comercio y más.',
};

export default function UnetePage() {
    return (
        <main className="pt-20">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Únete a los Eventos</h1>
                    <p className="text-xl">Sé parte de la experiencia del Parque Hípico La Montaña y haz crecer tu emprendimiento</p>
                </div>
            </section>

            {/* Categorías */}
            {categorias.map((categoria, index) => (
                <section key={categoria.id} className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="text-center mb-12">
                            <span className="text-5xl mb-4 block">
                                {categoria.icono === 'music' && '🎵'}
                                {categoria.icono === 'food' && '🍔'}
                                {categoria.icono === 'shop' && '🛍️'}
                                {categoria.icono === 'award' && '🏆'}
                                {categoria.icono === 'briefcase' && '💼'}
                            </span>
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">{categoria.titulo}</h2>
                            <p className="text-lg text-slate-600 max-w-3xl mx-auto">{categoria.descripcion}</p>
                        </div>

                        {categoria.id === 'patrocinios' ? (
                            // Caso especial para patrocinios
                            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Beneficios para Patrocinadores</h3>
                                <ul className="space-y-4">
                                    {categoria.subcategorias[0].requisitos?.map((beneficio, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-slate-700 text-lg">{beneficio}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            // Resto de categorías
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {categoria.subcategorias.map(sub => (
                                    <div key={sub.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">{sub.titulo}</h3>
                                        <p className="text-slate-600">{sub.descripcion}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            ))}

            {/* Formulario de Postulación */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Postula</h2>
                        <p className="text-xl text-slate-300">Envíanos tu propuesta y únete a la familia del Parque Hípico La Montaña</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
                        <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-slate-300">Email</p>
                                    <a href="mailto:parquehipicolamontana@gmail.com" className="text-lg font-semibold text-white hover:text-amber-400">
                                        parquehipicolamontana@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-slate-300">Teléfono</p>
                                    <a href="tel:+56971636195" className="text-lg font-semibold text-white hover:text-amber-400">
                                        +56 9 7163 6195
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-slate-300">WhatsApp</p>
                                    <a href="https://wa.me/56971636195" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-white hover:text-amber-400">
                                        +56 9 7163 6195
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <a
                            href="https://wa.me/56971636195?text=Hola,%20me%20interesa%20postular%20para%20participar%20en%20los%20eventos%20del%20Parque%20Hípico%20La%20Montaña"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Enviar Propuesta por WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
