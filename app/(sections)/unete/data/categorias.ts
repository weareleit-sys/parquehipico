// Tipos de datos para la sección Únete
export interface Subcategoria {
    id: string;
    titulo: string;
    descripcion: string;
    requisitos?: string[];
}

export interface Categoria {
    id: string;
    titulo: string;
    descripcion: string;
    icono: string;
    subcategorias: Subcategoria[];
}

// Base de datos de categorías para Únete
export const categorias: Categoria[] = [
    {
        id: 'artistas',
        titulo: 'Artistas',
        descripcion: 'Buscamos músicos, bandas, DJ y artistas para presentarse en nuestros eventos.',
        icono: 'music',
        subcategorias: [
            {
                id: 'musicos-folkloricos',
                titulo: 'Músicos folclóricos',
                descripcion: 'Músicos de folclor y música tradicional chilena.'
            },
            {
                id: 'bandas',
                titulo: 'Bandas',
                descripcion: 'Bandas de cumbia, rock y pop.'
            },
            {
                id: 'djs',
                titulo: 'DJs',
                descripcion: 'DJs para sets nocturnos y eventos especiales.'
            },
            {
                id: 'artistas-circenses',
                titulo: 'Artistas circenses',
                descripcion: 'Artistas circenses y animadores para eventos familiares.'
            }
        ]
    },
    {
        id: 'gastronomia',
        titulo: 'Oferta Culinaria',
        descripcion: 'Espacio para food trucks, carritos y emprendimientos gastronómicos.',
        icono: 'food',
        subcategorias: [
            {
                id: 'food-trucks',
                titulo: 'Food trucks',
                descripcion: 'Food trucks con variedad de comida chilena e internacional.'
            },
            {
                id: 'comida-rapida',
                titulo: 'Comida rápida',
                descripcion: 'Puestos de comida rápida y snacks para eventos.'
            },
            {
                id: 'cafeterias',
                titulo: 'Cafeterías móviles',
                descripcion: 'Cafeterías móviles y servicios de bebidas calientes.'
            },
            {
                id: 'reposteria',
                titulo: 'Repostería',
                descripcion: 'Repostería y postres artesanales para eventos especiales.'
            }
        ]
    },
    {
        id: 'comercio',
        titulo: 'Comercio',
        descripcion: 'Vende tus productos en nuestras ferias y días de evento.',
        icono: 'shop',
        subcategorias: [
            {
                id: 'artesania',
                titulo: 'Artesanía',
                descripcion: 'Productos hechos a mano, textiles y decoración artesanal.'
            },
            {
                id: 'productos-regionales',
                titulo: 'Productos regionales',
                descripcion: 'Mieles, conservas, quesos y productos típicos de la zona.'
            },
            {
                id: 'emprendimientos',
                titulo: 'Emprendimientos',
                descripcion: 'Ropa, accesorios y productos innovadores.'
            }
        ]
    },
    {
        id: 'patrocinios',
        titulo: 'Patrocinios',
        descripcion: 'Empresas interesadas en patrocinar eventos y carreras del parque.',
        icono: 'award',
        subcategorias: [
            {
                id: 'beneficios',
                titulo: 'Beneficios para patrocinadores',
                descripcion: '',
                requisitos: [
                    'Presencia de marca en eventos masivos',
                    'Espacios publicitarios en el parque',
                    'Menciones en redes sociales y medios',
                    'Acceso preferencial y entradas VIP',
                    'Participación en activaciones de marca'
                ]
            }
        ]
    },
    {
        id: 'otros',
        titulo: 'Otros',
        descripcion: 'Proveedores de servicios, fotógrafos, animadores y más.',
        icono: 'briefcase',
        subcategorias: [
            {
                id: 'fotografos',
                titulo: 'Fotógrafos',
                descripcion: 'Cobertura de eventos y carreras profesionales.'
            },
            {
                id: 'animadores',
                titulo: 'Animadores',
                descripcion: 'Entretenimiento para niños y familias.'
            },
            {
                id: 'servicios-generales',
                titulo: 'Servicios generales',
                descripcion: 'Limpieza, seguridad, logística y más.'
            }
        ]
    }
];

// Función helper para obtener categoría por ID
export function getCategoriaPorId(id: string): Categoria | undefined {
    return categorias.find(cat => cat.id === id);
}
