'use client';

import styles from './SocialLinks.module.css';

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/parquehipicolamontana/',
    icon: 'fab fa-instagram',
    class: 'instagram',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/parquehipico/',
    icon: 'fab fa-facebook',
    class: 'facebook',
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@haras.as7?_t=ZM-90zAh0vzCIO&_r=1',
    icon: 'fab fa-tiktok',
    class: 'tiktok',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@ParquehípicoLaMontaña',
    icon: 'fab fa-youtube',
    class: 'youtube',
  },
];

export default function SocialLinks() {
  return (
    <div className={styles.socialMedia} aria-label="Redes sociales">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.socialLink} ${styles[link.class]}`}
          aria-label={`${link.name} de Parque Hípico La Montaña`}
          title={link.name}
        >
          <i className={link.icon}></i>
        </a>
      ))}
    </div>
  );
}

