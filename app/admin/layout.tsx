import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin | Parque Hípico",
    description: "Panel de administración",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Layout limpio sin Navbar, Footer ni WhatsApp flotante */}
            {children}
        </>
    );
}
