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
        titulo: "Carreras a la Chilena",
        fecha: "17 de Enero",
        hora: "12:00 HRS",
        descripcion: "Adrenalina y tradición. Disfruta de las mejores carreras a la chilena en un ambiente único.",
        precioInt: 20000, // Precio base referencia (hombre)
        precios: {
            hombres: "20.000",
            mujeres: "10.000",
            general: undefined
        },
        features: ["Carreras en vivo", "Comida Típica", "Música Chilena"],
        imagen: "/eventos/carreras-2025.png",
        destacado: true,
        estado: "disponible",
        tipoVenta: 'ticket'
    },
    {
        id: 2,
        titulo: "Feria Costumbrista",
        fecha: "24 y 25 de Enero",
        hora: "11:00 HRS",
        descripcion: "Lo mejor de nuestras tradiciones. Artesanía, gastronomía y folklore en vivo.",
        precioInt: 20000,
        precios: {
            hombres: "20.000",
            mujeres: "10.000",
            general: undefined
        },
        features: ["Gastronomía", "Artesanía", "Show Folklórico"],
        imagen: "/eventos/feria-2025.png",
        destacado: false,
        estado: "disponible",
        tipoVenta: 'ticket'
    },
    {
        id: 3,
        titulo: "La Montaña del Amor",
        fecha: "14 de Febrero",
        hora: "20:00 HRS",
        descripcion: "Celebra el día de los enamorados bajo las estrellas con música romántica y cena especial.",
        precioInt: 20000,
        precios: {
            hombres: "20.000",
            mujeres: "10.000",
            general: undefined
        },
        features: ["Cena Romántica", "Música en Vivo", "Fiesta Bailable"],
        imagen: "/eventos/san-valentin-2025.png",
        destacado: true,
        estado: "proximamente",
        tipoVenta: 'ticket'
    }
];
