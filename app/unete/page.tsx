import { FaMusic, FaUtensils, FaStore, FaHandshake, FaWhatsapp, FaChild } from 'react-icons/fa';

export const metadata = {
    title: 'Trabaja con Nosotros | Parque Hípico La Montaña',
    description: 'Postula tu banda, food truck o marca para ser parte de nuestros eventos.',
};

// Datos de las categorías (Incluyendo "Entretención Niños")
const categorias = [
    {
        id: 1,
        titulo: "Artistas & Escena",
        descripcion: "Músicos, bandas en vivo, DJs y artistas circenses para encender el ambiente.",
        icono: FaMusic
    },
    {
        id: 2,
        titulo: "Gastronomía",
        descripcion: "Food trucks, cafeterías de especialidad, repostería y carros de comida.",
        icono: FaUtensils
    },
    {
        id: 3,
        titulo: "Comercio Local",
        descripcion: "Stands de artesanía, productos regionales y emprendedores de la zona.",
        icono: FaStore
    },
    {
        id: 4,
        titulo: "Entretención Infantil",
        descripcion: "Juegos inflables, pintacaritas, zonas de juegos y actividades recreativas.",
        icono: FaChild
    },
    {
        id: 5,
        titulo: "Patrocinios",
        descripcion: "Empresas y marcas que quieran presencia de marca en eventos masivos.",
        icono: FaHandshake
    }
];

export default function UnetePage() {
    return (
        <main className="min-h-screen bg-slate-950 pt-24">

            {/* HERO SECTION */}
            <section className="relative py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2 block">
                        Convocatoria Abierta
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                        Únete a los Eventos
                    </h1>
                    <p className="text-xl text-slate-400">
                        Sé parte de la experiencia del Parque Hípico La Montaña. Buscamos socios estratégicos para elevar el nivel de cada jornada.
                    </p>
                </div>
            </section>

            {/* GRILLA DE CATEGORÍAS */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                        {categorias.map((cat) => (
                            <div key={cat.id} className="group bg-slate-900 p-8 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/10">
                                <div className="w-14 h-14 bg-slate-950 rounded-lg flex items-center justify-center mb-6 text-amber-500 text-2xl group-hover:scale-110 transition-transform duration-300 border border-slate-800 group-hover:border-amber-500/30">
                                    <cat.icono />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-500 transition-colors">
                                    {cat.titulo}
                                </h3>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    {cat.descripcion}
                                </p>
                            </div>
                        ))}

                        {/* Tarjeta Extra: Invitación General (Para rellenar la grilla visualmente) */}
                        <div className="bg-slate-950/50 p-8 rounded-xl border border-slate-800 border-dashed flex flex-col justify-center items-center text-center">
                            <p className="text-slate-500 font-bold text-lg mb-2">¿Tienes otra propuesta?</p>
                            <p className="text-slate-600 text-sm">Estamos abiertos a nuevas ideas innovadoras.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA WHATSAPP */}
            <section className="py-20 bg-slate-900 relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[100px] rounded-full"></div>

                <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                        ¿Listo para trabajar juntos?
                    </h2>
                    <p className="text-slate-400 mb-10">
                        Envíanos tu portafolio, fotos de tu stand o propuesta comercial directamente a nuestro equipo de producción.
                    </p>

                    <a
                        href="https://wa.me/56993330628?text=Hola,%20me%20interesa%20participar%20en%20los%20eventos%20del%20Parque.%20Mi%20rubro%20es..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-green-900/20 transition-all transform hover:scale-105"
                    >
                        <FaWhatsapp className="text-2xl" />
                        Enviar Propuesta por WhatsApp
                    </a>
                </div>
            </section>

        </main>
    );
}
