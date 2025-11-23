import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton/FloatingWhatsAppButton";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Parque Hípico La Montaña - Sitio Oficial",
  description: "El lugar ideal para disfrutar de tradición, adrenalina y diversión en familia",
  keywords: "parque hípico, carreras de caballos, eventos, entretenimiento, Chile",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} ${montserrat.variable}`}>
        <Header />
        {children}
        <Footer />
        {/* Botón flotante de WhatsApp - Global en todas las páginas */}
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}

