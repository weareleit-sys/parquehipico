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
        fecha: "21 de Junio",
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
    }
];
