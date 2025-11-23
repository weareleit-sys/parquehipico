// Tipos de datos para eventos
export interface Evento {
    id: string;
    titulo: string;
    fecha: Date;
    hora: string;
    descripcion: string;
    descripcionLarga?: string;
    capacidad: number;
    precioDesde: number;
    categoria: 'FIESTA' | 'CARRERA' | 'FESTIVAL' | 'CORPORATIVO' | 'FAMILIAR';
    estado: 'EN_VENTA' | 'PROXIMAMENTE' | 'AGOTADO';
    imagen?: string;
    ubicacion: string;
    artistas?: string[];
}

// Base de datos de eventos
// NOTA: Estos eventos son de ejemplo. Actualizar con eventos reales.
export const eventos: Evento[] = [
    {
        id: 'clasico-noviembre-2025',
        titulo: 'Clásico de Noviembre',
        fecha: new Date('2025-11-30'),
        hora: '14:00',
        descripcion: 'Último domingo de noviembre',
        descripcionLarga: 'Competencia clásica de carreras a la chilena con los mejores ejemplares de la región. Incluye zona gastronómica y entretenimiento familiar.',
        capacidad: 5000,
        precioDesde: 8000,
        categoria: 'CARRERA',
        estado: 'EN_VENTA',
        imagen: '/eventos/clasico-noviembre.jpg', // 📸 FOTO NECESARIA: Carrera de caballos en acción, público en tribunas
        ubicacion: 'Parque Hípico La Montaña',
        artistas: []
    },
    {
        id: 'copa-diciembre-2025',
        titulo: 'Copa Diciembre',
        fecha: new Date('2025-12-20'),
        hora: '15:00',
        descripcion: 'Competencia especial de fin de año',
        descripcionLarga: 'Evento especial para despedir el año con las mejores carreras y premiaciones. Incluye actividades familiares y zona gastronómica.',
        capacidad: 5000,
        precioDesde: 10000,
        categoria: 'CARRERA',
        estado: 'EN_VENTA',
        imagen: '/eventos/copa-diciembre.jpg', // 📸 FOTO NECESARIA: Evento de carreras con decoración navideña
        ubicacion: 'Parque Hípico La Montaña',
        artistas: []
    },
    {
        id: 'gran-cierre-ano-2025',
        titulo: 'Gran Cierre de Año',
        fecha: new Date('2025-12-31'),
        hora: '20:00',
        descripcion: 'Despedimos la temporada',
        descripcionLarga: 'Evento de clausura con actividades familiares, música en vivo, cena buffet, barra libre y fuegos artificiales a medianoche.',
        capacidad: 3000,
        precioDesde: 35000,
        categoria: 'FIESTA',
        estado: 'EN_VENTA',
        imagen: '/eventos/gran-cierre.jpg', // 📸 FOTO NECESARIA: Fiesta nocturna con luces, escenario y público celebrando
        ubicacion: 'Parque Hípico La Montaña',
        artistas: ['Por confirmar'] // Actualizar cuando se confirmen artistas
    }
];

// Función helper para obtener eventos próximos
export function getEventosProximos(limite: number = 3): Evento[] {
    const hoy = new Date();
    return eventos
        .filter(evento => evento.fecha >= hoy)
        .sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
        .slice(0, limite);
}

// Función helper para obtener evento por ID
export function getEventoPorId(id: string): Evento | undefined {
    return eventos.find(evento => evento.id === id);
}

// Función helper para obtener eventos por mes
export function getEventosPorMes(mes: number, año: number): Evento[] {
    return eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        return fechaEvento.getMonth() === mes && fechaEvento.getFullYear() === año;
    });
}
