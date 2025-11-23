'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Navigation.module.css';

const navigationData = [
  {
    id: 'park',
    label: 'Parque Hípico',
    href: '/parquehipico',
    submenu: [
      { label: 'Visión y Misión', href: '/parquehipico#vision' },
      { label: 'Características', href: '/parquehipico#caracteristicas' },
      { label: 'Ubicación', href: '/parquehipico#ubicacion' },
      { label: 'Seguridad', href: '/parquehipico#seguridad' },
      { label: 'Estacionamientos', href: '/parquehipico#estacionamientos' },
    ],
  },
  {
    id: 'races',
    label: 'Carreras a la Chilena',
    href: '/carreras',
    submenu: [
      { label: 'Fechas disponibles', href: '/carreras#fechas' },
      { label: 'Inscripciones', href: '/carreras#inscripciones' },
      { label: 'Premios', href: '/carreras#premios' },
      { label: 'Apuestas', href: '/carreras#apuestas' },
      { label: 'Últimos ganadores', href: '/carreras#ganadores' },
    ],
  },
  {
    id: 'entertainment',
    label: 'Entretención todo Público',
    href: '/entretencion',
    submenu: [
      { label: 'Experiencia hípica', href: '/entretencion#experiencia' },
      { label: 'Gastronomía', href: '/entretencion#gastronomia' },
      { label: 'Entorno familiar', href: '/entretencion#familiar' },
      { label: 'Música', href: '/entretencion#musica' },
      { label: 'Tiendas', href: '/entretencion#tiendas' },
    ],
  },
  {
    id: 'events',
    label: 'Centro de Eventos',
    href: '/eventos',
    submenu: [
      { label: 'Tipos de eventos', href: '/eventos#tipos' },
      { label: 'Qué ofrecemos', href: '/eventos#ofrecemos' },
      { label: 'Cotiza aquí', href: '/eventos#cotizar' },
    ],
  },
  {
    id: 'join',
    label: 'Únete a los eventos',
    href: '/unete',
    submenu: [
      { label: 'Artistas', href: '/unete#artistas' },
      { label: 'Oferta culinaria', href: '/unete#culinaria' },
      { label: 'Comercio', href: '/unete#comercio' },
      { label: 'Patrocinios', href: '/unete#patrocinios' },
      { label: 'Otros', href: '/unete#otros' },
      { label: 'Postula', href: '/unete#postula' },
    ],
  },
];

interface NavItemProps {
  item: typeof navigationData[0];
}

function NavItem({ item }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className={styles.navItem}>
      <Link 
        href={item.href}
        className={styles.navLink}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {item.label}
        <i className="fas fa-chevron-right"></i>
      </Link>

      {item.submenu && (
        <ul 
          className={`${styles.dropdownMenu} ${isOpen ? styles.open : ''}`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {item.submenu.map((subitem) => (
            <li key={subitem.label}>
              <Link href={subitem.href} className={styles.dropdownLink}>
                {subitem.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Navigation() {
  return (
    <nav className={styles.mainNavigation} aria-label="Navegación principal">
      <ul className={styles.navMenu}>
        {navigationData.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
}

