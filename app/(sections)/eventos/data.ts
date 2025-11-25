export interface Evento {
    id: number;
    titulo: string;
    fecha: string;
    hora: string;
    descripcion: string;
    precioInt: number; // Precio numérico para calcular el total
    precios: {
        hombres?: string;
        mujeres?: string;
        general?: string;
    };
    features: string[];
    imagen: string | null;
    destacado: boolean;
    estado: 'disponible' | 'agotado' | 'finalizado' | 'proximamente';
    tipoVenta: 'ticket' | 'whatsapp'; // 👈 ESTO DEFINE EL COMPORTAMIENTO
}

export const eventos: Evento[] = [
    {
        id: 1,
        titulo: "Gran Carrera - La Montaña",
        fecha: "30 de Noviembre",
        hora: "12:00 HRS",
        descripcion: "Adrenalina pura y ambiente familiar. Pago en puerta o transferencia previa.",
        precioInt: 15000,
        precios: {
            hombres: "15.000",
            mujeres: "5.000",
            general: undefined
        },
        features: ["Carreras a la chilena", "Música en vivo", "Pago en Puerta"],
        imagen: "/eventos/nov30.jpg",
        destacado: true,
        estado: "disponible",
        tipoVenta: 'whatsapp' // 👈 MODO CLÁSICO
    },
    {
        id: 2,
        titulo: "Copa Diciembre",
        fecha: "20 de Diciembre",
        hora: "12:00 HRS",
        descripcion: "Grandes competidores en pista. La revancha esperada.",
        precioInt: 20000,
        precios: {
            hombres: "20.000",
            mujeres: "5.000",
            general: undefined
        },
        features: ["Grandes Apuestas", "DJ en vivo", "Zona Picnic"],
        imagen: null,
        destacado: false,
        estado: "proximamente",
        tipoVenta: 'whatsapp'
    },
    {
        id: 3,
        titulo: "AÑO NUEVO 2025",
        fecha: "31 de Diciembre",
        hora: "22:00 HRS",
        descripcion: "La fiesta más grande del sur. Artista invitado sorpresa.",
        precioInt: 40000,
        precios: {
            general: "40.000"
        },
        features: ["Barra Abierta", "Camping Incluido", "Fuegos Artificiales"],
        imagen: null,
        destacado: true,
        estado: "disponible",
        tipoVenta: 'ticket' // 👈 MODO PUNTOTICKET PROPIO
    }
];
