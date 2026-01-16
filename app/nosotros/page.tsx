import { FaMapMarkedAlt, FaShieldAlt, FaCar, FaLayerGroup, FaHistory, FaRoute } from 'react-icons/fa';

export const metadata = {
    title: 'Nosotros | Parque Hípico La Montaña',
    description: 'Conoce nuestra historia, misión y visión. El epicentro de eventos en la Araucanía.',
};

export default function NosotrosPage() {
    return (
        <main className="min-h-screen bg-slate-950 pt-24">

            {/* HERO SECTION */}
            <section className="relative py-20 bg-slate-900 border-b border-slate-800">
                <div className="absolute inset-0 bg-[url('/pattern-dark.png')] opacity-5"></div>
                <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
                    <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2 block">
                        Nuestra Historia
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                        El Corazón de la Araucanía
                    </h1>
                    <p className="text-xl text-slate-400">
                        Más que un recinto, somos un punto de encuentro donde la tradición chilena y la modernidad se dan la mano.
                    </p>
                </div>
            </section>

            {/* MISIÓN Y VISIÓN */}
            <section className="py-20 bg-slate-950">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Visión */}
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition-colors">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-amber-500 text-4xl">👁️</span> Nuestra Visión
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                Ser el centro de eventos más reconocido del sur de Chile, ofreciendo experiencias memorables que combinen tradición, naturaleza y entretenimiento de calidad para toda la familia.
                            </p>
                        </div>
                        {/* Misión */}
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition-colors">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-amber-500 text-4xl">🚀</span> Nuestra Misión
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                Proporcionar un espacio versátil y profesional para eventos de todo tipo, manteniendo viva la tradición de las carreras a la chilena y promoviendo el desarrollo cultural y económico de la región.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CARACTERÍSTICAS (GRID) */}
            <section className="py-20 bg-slate-900">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">¿Por qué elegirnos?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: FaMapMarkedAlt, title: "Ubicación Estratégica", desc: "Fácil acceso desde la carretera principal, visible y accesible para todos." },
                            { icon: FaLayerGroup, title: "Infraestructura Completa", desc: "Instalaciones modernas con servicios necesarios para eventos masivos." },
                            { icon: FaShieldAlt, title: "Seguridad 24/7", desc: "Perímetro controlado con personal de seguridad activo día y noche." },
                            { icon: FaCar, title: "Estacionamiento Amplio", desc: "Capacidad para más de 500 vehículos con zonas diferenciadas." },
                            { icon: FaHistory, title: "Tradición", desc: "Más de 10 años promoviendo la cultura ecuestre y eventos comunitarios." },
                            { icon: FaRoute, title: "Versatilidad", desc: "Espacios adaptables para conciertos, ferias, carreras y matrimonios." },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center p-6 hover:bg-slate-800 rounded-xl transition-all duration-300">
                                <item.icon className="text-amber-500 text-4xl mb-4" />
                                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                <p className="text-slate-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CÓMO LLEGAR + MAPA */}
            <section className="py-20 bg-slate-950">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">

                        {/* Columna Izquierda: Instrucciones */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-6">Ubicación y Accesos</h2>
                                <p className="text-slate-400 mb-4 flex items-start gap-2">
                                    <FaMapMarkedAlt className="text-amber-500 mt-1 shrink-0" />
                                    <span>Nancahue, Ruta S-743, Loncoche, Región de la Araucanía.</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-900 p-6 rounded-lg border-l-4 border-amber-500">
                                    <h4 className="text-white font-bold mb-2">Desde Villarrica (Norte)</h4>
                                    <p className="text-sm text-slate-400">Toma la Ruta S-91 hacia el sur (dirección Loncoche). Avanza aproximadamente 25 km hasta el cruce Huiscapi/Nancahue y sigue las señales al parque.</p>
                                </div>
                                <div className="bg-slate-900 p-6 rounded-lg border-l-4 border-slate-700">
                                    <h4 className="text-white font-bold mb-2">Desde Loncoche (Sur)</h4>
                                    <p className="text-sm text-slate-400">Sal por el norte tomando la Ruta S-91. A unos 15 km encontrarás el acceso al sector Nancahue a mano derecha.</p>
                                </div>
                                <div className="bg-slate-900 p-6 rounded-lg border-l-4 border-slate-700">
                                    <h4 className="text-white font-bold mb-2">Desde Temuco</h4>
                                    <p className="text-sm text-slate-400">Ruta 5 Sur hasta el cruce Loncoche. Ingresa a la ciudad y toma la salida norte hacia Villarrica (Ruta S-91). El parque estará a 20 min.</p>
                                </div>
                                <div className="bg-slate-900 p-6 rounded-lg border-l-4 border-slate-700">
                                    <h4 className="text-white font-bold mb-2">Desde Ñancul</h4>
                                    <p className="text-sm text-slate-400">Conecta con Villarrica vía Ruta S-65, cruza la ciudad hacia la salida sur (Ruta S-91) y continúa recto hacia Loncoche.</p>
                                </div>
                            </div>


                        </div>

                        {/* Columna Derecha: Mapa Google Maps */}
                        <div className="h-[600px] w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
                            {/* IFRAME DE GOOGLE MAPS */}
                            <iframe
                                src="https://maps.google.com/maps?q=Cancha+Hipica+La+Monta%C3%B1a&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100"
                            ></iframe>

                            {/* Overlay de estilo para que se vea integrado */}
                            <div className="absolute top-4 right-4 bg-slate-950/90 p-4 rounded-lg shadow-lg border border-slate-800 backdrop-blur-sm">
                                <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">Coordenadas</p>
                                <p className="text-white text-sm font-mono">Sector Nancahue</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </main>
    );
}
