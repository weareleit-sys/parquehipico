'use client';

import styles from './Footer.module.css';

const siteConfig = {
  contact: {
    address: 'NANCAHUE, S-743, PC G, LONCOCHE, Loncoche, Araucanía, Chile',
    phone: '+56 9 7163 6195',
    email: 'parquehipicolamontana@gmail.com',
    copyright: '© 2025 Parque Hípico La Montaña. Desarrollado por Eleit',
  },
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <p>
              <strong>Dirección:</strong> {siteConfig.contact.address}
            </p>
            <p>
              <strong>Teléfono:</strong> {siteConfig.contact.phone}
            </p>
            <p>
              <strong>Email:</strong> {siteConfig.contact.email}
            </p>
            <p>
              <strong>Copyright:</strong> {siteConfig.contact.copyright}
            </p>
          </div>
          <div className={styles.footerLinksBottom}>
            <a href="#terminos" className={styles.footerLink}>
              Términos de uso y privacidad
            </a>
            <a href="#denuncias" className={styles.footerLink}>
              Denuncias
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

