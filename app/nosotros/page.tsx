import ParallaxLogo from '@/components/UI/ParallaxLogo';
import { FaMapMarkedAlt } from 'react-icons/fa';

export const metadata = {
    title: 'Nosotros | Parque Hípico La Montaña',
    description: 'Conoce nuestra historia, misión y visión. El epicentro de eventos en la Araucanía.',
};

export default function NosotrosPage() {
    return (
        <main className="min-h-screen bg-slate-950">
            {/* HERO SECTION CON PARALLAX */}
            <ParallaxLogo maxOpacity={0.15} />

            {/* HERO VISUAL PRINCIPAL */}
            <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden border-b border-slate-800">
                <div className="absolute inset-0">
                    <img
                        src="/hero-bg.jpg"
                        alt="Parque Hípico La Montaña"
                        className="w-full h-full object-cover object-center brightness-[0.4]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-5xl translate-y-8">
                    <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-6 block animate-fade-in-up">
                        Nuestra Historia
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-none">
                        EL CORAZÓN DE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">LA ARAUCANÍA</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                        Donde la tradición chilena y la pasión ecuestre se encuentran.
                    </p>
                </div>
            </section>

            {/* HISTORIA Y TRADICIÓN */}
            <section className="py-24 bg-slate-950 relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative z-10 transition-transform duration-500 hover:scale-[1.02]">
                                <img
                                    src="/nosotros/tradicion.jpg"
                                    alt="Equipo ganador celebrando"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4 block">
                                Nuestra Esencia
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                                Más que carreras, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">una tradición viva</span>.
                            </h2>
                            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                                En Parque Hípico La Montaña, la adrenalina de la pista se mezcla con la calidez de nuestra gente. Nacimos del amor por los caballos y la tierra chilena, convirtiéndonos en el corazón palpitante de Villarrica y Loncoche.
                            </p>
                            <p className="text-lg text-slate-300 leading-relaxed">
                                Cada fin de semana, celebramos no solo a los ganadores, sino el esfuerzo, la camaradería y la pasión que nos une. Aquí, la historia se escribe en cada carrera y en cada brindis compartido.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMUNIDAD */}
            <section className="py-24 bg-slate-900 border-y border-slate-800">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4 block">
                                Nuestra Comunidad
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                                Un lugar de <span className="text-amber-500">encuentro</span>.
                            </h2>
                            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                                Somos el punto de reunión donde familias y amigos vienen a disfrutar de lo mejor de nuestra zona. Música, gastronomía y un ambiente seguro crean el escenario perfecto para desconectarse y vivir momentos auténticos.
                            </p>
                            <p className="text-lg text-slate-300 leading-relaxed">
                                Ya sea celebrando un triunfo o simplemente disfrutando de la tarde, en La Montaña todos son bienvenidos a ser parte de nuestra gran familia.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative z-10 transition-transform duration-500 hover:scale-[1.02]">
                                <img
                                    src="/nosotros/comunidad.jpg"
                                    alt="Comunidad compartiendo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MARCA E IDENTIDAD */}
            <section className="py-24 bg-slate-950 relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative z-10 transition-transform duration-500 hover:scale-[1.02]">
                                <img
                                    src="/nosotros/marca.jpg"
                                    alt="Identidad La Montaña"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4 block">
                                Identidad
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                                Orgullo por <br />lo nuestro.
                            </h2>
                            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                                Llevamos "La Montaña" en el pecho como símbolo de fortaleza y permanencia. Trabajamos día a día para elevar el estándar de los eventos en la región, sin perder la esencia campechana que nos caracteriza.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CÓMO LLEGAR + MAPA (Simplificado y Moderno) */}
            <section className="py-24 bg-slate-900 border-t border-slate-800">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-12">
                        <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2 block">
                            ¿Dónde estamos?
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Tu destino en la Araucanía</h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Columna Izquierda: Instrucciones */}
                        <div className="space-y-8">
                            <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 transition-colors hover:border-amber-500/30">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <FaMapMarkedAlt className="text-amber-500" />
                                    Nancahue, Ruta S-743
                                </h3>
                                <p className="text-slate-400 text-lg">
                                    Ubicados estratégicamente entre Villarrica y Loncoche, con accesos expeditos asfaltados.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="pl-6 border-l-4 border-amber-500 py-2">
                                    <h4 className="text-white font-bold text-lg mb-2">Desde Villarrica</h4>
                                    <p className="text-slate-400">Ruta S-91 al sur (25km) → Cruce Huiscapi/Nancahue.</p>
                                </div>
                                <div className="pl-6 border-l-4 border-slate-700 py-2 hover:border-amber-500 transition-colors duration-300 cursor-default">
                                    <h4 className="text-white font-bold text-lg mb-2">Desde Loncoche</h4>
                                    <p className="text-slate-400">Salida norte Ruta S-91 (15km) → Acceso Nancahue a la derecha.</p>
                                </div>
                                <div className="pl-6 border-l-4 border-slate-700 py-2 hover:border-amber-500 transition-colors duration-300 cursor-default">
                                    <h4 className="text-white font-bold text-lg mb-2">Desde Temuco</h4>
                                    <p className="text-slate-400">Ruta 5 Sur → Loncoche → Ruta S-91 a Villarrica.</p>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Mapa Google Maps */}
                        <div className="h-[500px] w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative group">
                            <div className="absolute inset-0 bg-slate-900 animate-pulse -z-10"></div> {/* Loading placeholder bg */}
                            <iframe
                                src="https://maps.google.com/maps?q=Cancha+Hipica+La+Monta%C3%B1a&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
