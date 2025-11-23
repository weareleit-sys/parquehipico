'use client';

import { useState, useEffect } from 'react';
import styles from './FloatingWhatsAppButton.module.css';

/**
 * Componente FloatingWhatsAppButton
 * 
 * Botón flotante global que aparece en todas las páginas del sitio.
 * Ubicación: esquina inferior derecha (fixed)
 * 
 * Características:
 * - Botón circular con ícono de WhatsApp
 * - Abre WhatsApp con mensaje preconfigurado
 * - Se adapta a móvil y desktop
 * - Reutilizable en el layout global
 */
export default function FloatingWhatsAppButton() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const whatsappUrl = 'https://wa.me/56971636195?text=Hola,%20quiero%20coordinar%20carreras%20y%20eventos%20en%20Parque%20H%C3%ADpico%20La%20Monta%C3%B1a.';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.floatingButton}
      title="Coordinar por WhatsApp"
      aria-label="Botón flotante de WhatsApp"
    >
      {/* SVG del ícono de WhatsApp */}
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.819 0-3.578.797-4.744 2.188-.944 1.054-1.478 2.45-1.478 3.954 0 3.365 2.736 6.1 6.1 6.1 1.504 0 2.9-.533 3.954-1.478 1.391-1.166 2.188-2.925 2.188-4.744 0-3.365-2.736-6.1-6.1-6.1zm0-2c2.405 0 4.671.994 6.336 2.659s2.659 3.931 2.659 6.336c0 2.405-.994 4.671-2.659 6.336s-3.931 2.659-6.336 2.659c-2.405 0-4.671-.994-6.336-2.659S1 15.901 1 13.496c0-2.405.994-4.671 2.659-6.336S8.591 4.501 11.051 4.501z" />
      </svg>

      {/* Texto en desktop */}
      {!isMobile && (
        <span className={styles.text}>WhatsApp</span>
      )}
    </a>
  );
}




