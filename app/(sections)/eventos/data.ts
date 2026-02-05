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
        fecha: "15 de Febrero",
        hora: "14:00 HRS",
        descripcion: "Adrenalina y tradición. Disfruta de las mejores carreras a la chilena en un ambiente único.",
        precioInt: 15000, // Precio base (hombre)
        precios: {
            hombres: "15.000",
            mujeres: "5.000",
            general: undefined
        },
        features: ["Carreras en vivo", "Comida Típica", "Música Chilena"],
        imagen: "/eventos/carreras-chilena.jpg",
        destacado: true,
        estado: "disponible",
        tipoVenta: 'ticket'
    },
    {
        id: 2,
        titulo: "Feria Costumbrista (Sábado)",
        fecha: "21 de Febrero",
        hora: "11:00 HRS",
        descripcion: "Lo mejor de nuestras tradiciones. Artesanía, gastronomía y folklore en vivo. Día 1.",
        precioInt: 5000,
        precios: {
            hombres: undefined,
            mujeres: undefined,
            general: "5.000"
        },
        features: ["Gastronomía", "Artesanía", "Show Folklórico"],
        imagen: "/eventos/feria-sabado.jpg",
        destacado: false,
        estado: "proximamente",
        tipoVenta: 'ticket'
    },
    {
        id: 3,
        titulo: "Feria Costumbrista (Domingo)",
        fecha: "22 de Febrero",
        hora: "11:00 HRS",
        descripcion: "Segundo día de fiesta y tradiciones. Comida típica, artesanía y show de cierre.",
        precioInt: 5000,
        precios: {
            hombres: undefined,
            mujeres: undefined,
            general: "5.000"
        },
        features: ["Gastronomía", "Artesanía", "Show de Cierre"],
        imagen: "/eventos/feria-domingo.jpg",
        destacado: false,
        estado: "proximamente",
        tipoVenta: 'ticket'
    }
];
