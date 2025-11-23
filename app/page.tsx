import { redirect } from 'next/navigation';

// Redirigir la raíz a la sección de inicio
export default function RootPage() {
  redirect('/inicio');
}
