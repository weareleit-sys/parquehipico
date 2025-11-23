// Datos de servicios para la sección Arrienda
export interface Servicio {
    id: string;
    titulo: string;
    descripcion: string;
    icono: string;
}

export const tiposEventos = [
    {
        id: 'corporativos',
        titulo: 'Eventos Corporativos',
        descripcion: 'Reuniones, lanzamientos y capacitaciones en un entorno natural y profesional.',
        icono: 'briefcase'
    },
    {
        id: 'matrimonios',
        titulo: 'Matrimonios',
        descripcion: 'Ceremonias y recepciones rodeadas de naturaleza, con opciones gastronómicas y música en vivo.',
        icono: 'heart'
    },
    {
        id: 'familiares',
        titulo: 'Eventos Familiares',
        descripcion: 'Cumpleaños, aniversarios y encuentros especiales con infraestructura segura y acogedora.',
        icono: 'users'
    }
];

export const servicios: Servicio[] = [
    {
        id: 'espacios',
        titulo: 'Espacios Flexibles',
        descripcion: 'Salones y áreas al aire libre con capacidad flexible hasta 5.000 personas.',
        icono: 'building'
    },
    {
        id: 'gastronomia',
        titulo: 'Gastronomía',
        descripcion: 'Gastronomía local, food trucks y banquetería profesional.',
        icono: 'utensils'
    },
    {
        id: 'estacionamiento',
        titulo: 'Estacionamientos',
        descripcion: 'Amplios estacionamientos y zonas de acceso controlado.',
        icono: 'parking'
    },
    {
        id: 'sonido',
        titulo: 'Sonido e Iluminación',
        descripcion: 'Escenario, sonido e iluminación para presentaciones en vivo.',
        icono: 'music'
    },
    {
        id: 'logistica',
        titulo: 'Apoyo Logístico',
        descripcion: 'Apoyo logístico, seguridad y limpieza integral.',
        icono: 'truck'
    },
    {
        id: 'personal',
        titulo: 'Personal Capacitado',
        descripcion: 'Personal capacitado para asistencia durante todo el evento.',
        icono: 'user-check'
    }
];

export const especificaciones = {
    capacidad: 5000,
    superficie: 30000,
    electricidad: 400,
    estacionamiento: 500
};
