import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Importamos los componentes globales
import Navbar from "./components/Header/Navbar";
import Footer from "./components/Footer/Footer";
import FloatingWhatsApp from "./components/UI/FloatingWhatsApp";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parque Hípico La Montaña",
  description: "El epicentro de eventos y tradición en Villarrica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>

        {/* 1. NAVBAR GLOBAL (Siempre visible arriba) */}
        <Navbar />

        {/* 2. CONTENIDO DE CADA PÁGINA */}
        {children}

        {/* 3. ELEMENTOS GLOBALES (Footer y botón flotante) */}
        <Footer />
        <FloatingWhatsApp />

      </body>
    </html>
  );
}
