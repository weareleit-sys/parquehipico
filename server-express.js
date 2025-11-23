/**
 * Servidor Express Simple
 * Para servir HTML estático mientras arreglamos Next.js
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));

// Ruta raíz: HOME
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parque Hípico La Montaña - Inicio</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Poppins', sans-serif; 
            background: #fdf8f0;
            color: #1B1B1B;
        }
        
        .header {
            background: #FFD700;
            padding: 15px 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .header-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 12px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }
        
        .brand {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1B1B1B;
        }
        
        .nav-links {
            display: flex;
            gap: 15px;
        }
        
        .nav-links a {
            color: #1B1B1B;
            text-decoration: none;
            font-weight: 600;
            padding: 8px 16px;
            border: 2px solid #1B1B1B;
            border-radius: 18px;
            background: #FFE55C;
            transition: all 0.3s ease;
            font-size: 0.85rem;
            text-transform: uppercase;
        }
        
        .nav-links a:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .social-links {
            display: flex;
            gap: 10px;
        }
        
        .social-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            border: 3px solid #1B1B1B;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        .social-icon.instagram { background: #E1306C; }
        .social-icon.facebook { background: #1877F2; }
        .social-icon.tiktok { background: #000000; }
        .social-icon.youtube { background: #FF0000; }
        
        .social-icon:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .hero {
            text-align: center;
            padding: 60px 20px;
            background: linear-gradient(135deg, #FFD700, #FFE55C);
            border-radius: 12px;
            border: 3px solid #1B1B1B;
            margin: 40px 0;
        }
        
        .hero h1 {
            font-size: 2.5rem;
            color: #0F3270;
            margin-bottom: 20px;
        }
        
        .hero p {
            font-size: 1.2rem;
            color: #1B1B1B;
            margin-bottom: 20px;
        }
        
        .hero-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 12px 24px;
            border: 3px solid #1B1B1B;
            border-radius: 18px;
            font-weight: 700;
            font-size: 0.95rem;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            box-shadow: 0 4px 0 #1B1B1B;
        }
        
        .btn-primary {
            background: #FFD700;
            color: #1B1B1B;
        }
        
        .btn-primary:hover {
            transform: translateY(2px);
            box-shadow: 0 2px 0 #1B1B1B;
        }
        
        .btn-secondary {
            background: #0F3270;
            color: #FFD700;
        }
        
        .btn-secondary:hover {
            transform: translateY(2px);
            box-shadow: 0 2px 0 #1B1B1B;
        }
        
        .sections {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }
        
        .section-card {
            background: white;
            border: 3px solid #FFD700;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
        }
        
        .section-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }
        
        .section-card h2 {
            font-size: 1.4rem;
            color: #0F3270;
            margin-bottom: 12px;
        }
        
        .section-card p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 16px;
        }
        
        .section-card a {
            display: inline-block;
            background: #FFD700;
            color: #1B1B1B;
            padding: 10px 20px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.9rem;
            border: 2px solid #1B1B1B;
            transition: all 0.3s ease;
        }
        
        .section-card a:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .floating-whatsapp {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #25D366, #128C7E);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 28px;
            text-decoration: none;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);
            transition: all 0.3s ease;
            z-index: 999;
        }
        
        .floating-whatsapp:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 8px 20px rgba(37, 211, 102, 0.45);
        }
        
        .footer {
            background: #333333;
            color: white;
            padding: 40px 0;
            text-align: center;
            margin-top: 60px;
        }
        
        .footer p {
            margin: 10px 0;
            font-size: 0.95rem;
            color: #ccc;
        }
        
        .footer strong {
            color: #FFD700;
        }
        
        @media (max-width: 768px) {
            .header-container {
                flex-wrap: wrap;
            }
            
            .hero h1 {
                font-size: 2rem;
            }
            
            .hero-buttons {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-container">
            <div class="brand">🐴 La Montaña</div>
            
            <nav class="nav-links">
                <a href="/">Inicio</a>
                <a href="/carreras">Carreras</a>
            </nav>
            
            <div class="social-links">
                <a href="https://www.instagram.com/parquehipicolamontana/" target="_blank" rel="noopener noreferrer" class="social-icon instagram" title="Instagram">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="https://www.facebook.com/parquehipico/" target="_blank" rel="noopener noreferrer" class="social-icon facebook" title="Facebook">
                    <i class="fab fa-facebook"></i>
                </a>
                <a href="https://www.tiktok.com/@haras.as7" target="_blank" rel="noopener noreferrer" class="social-icon tiktok" title="TikTok">
                    <i class="fab fa-tiktok"></i>
                </a>
                <a href="https://www.youtube.com/@ParquehípicoLaMontaña" target="_blank" rel="noopener noreferrer" class="social-icon youtube" title="YouTube">
                    <i class="fab fa-youtube"></i>
                </a>
            </div>
        </div>
    </header>

    <!-- Hero -->
    <div class="container">
        <div class="hero">
            <h1>🐴 Parque Hípico La Montaña</h1>
            <p>Tradición, adrenalina y diversión en familia</p>
            <div class="hero-buttons">
                <a href="/carreras" class="btn btn-primary">📅 Ver Carreras del Día</a>
                <a href="#servicios" class="btn btn-secondary">🎪 Conoce Nuestros Servicios</a>
            </div>
        </div>
    </div>

    <!-- Secciones -->
    <div class="container">
        <div class="sections" id="servicios">
            <div class="section-card">
                <h2>🏇 Carreras a la Chilena</h2>
                <p>Disfruta de emocionantes carreras de caballos, tradicionales y llenas de adrenalina. Evento familiar por excelencia.</p>
                <a href="/carreras">Ver programa →</a>
            </div>
            
            <div class="section-card">
                <h2>🎪 Entretenimiento</h2>
                <p>Actividades para toda la familia: juegos, gastronomía, entretenimiento en vivo y mucho más.</p>
                <a href="#" onclick="alert('Próximamente')">Ver más →</a>
            </div>
            
            <div class="section-card">
                <h2>📞 Coordina Con Nosotros</h2>
                <p>¿Quieres organizar un evento especial? Contacta con nuestro equipo por WhatsApp o teléfono.</p>
                <a href="https://wa.me/56971636195" target="_blank">Enviar mensaje →</a>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p><strong>Dirección:</strong> NANCAHUE, S-743, PC G, LONCOCHE, Loncoche, Araucanía, Chile</p>
            <p><strong>Teléfono:</strong> +56 9 7163 6195</p>
            <p><strong>Email:</strong> parquehipicolamontana@gmail.com</p>
            <p><strong>Copyright:</strong> © 2025 Parque Hípico La Montaña. Desarrollado por Eleit</p>
        </div>
    </footer>

    <!-- Botón flotante WhatsApp -->
    <a href="https://wa.me/56971636195?text=Hola,%20quiero%20coordinar%20carreras%20y%20eventos%20en%20Parque%20H%C3%ADpico%20La%20Monta%C3%B1a." target="_blank" rel="noopener noreferrer" class="floating-whatsapp" title="Coordinar por WhatsApp">
        💬
    </a>
</body>
</html>
  `);
});

// Ruta: CARRERAS
app.get('/carreras', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carreras a la Chilena | Parque Hípico La Montaña</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background: #fdf8f0; color: #1B1B1B; }
        
        .header {
            background: #FFD700;
            padding: 15px 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .header-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 12px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }
        
        .brand { font-size: 1.5rem; font-weight: 700; color: #1B1B1B; }
        .nav-links { display: flex; gap: 15px; }
        .nav-links a {
            color: #1B1B1B;
            text-decoration: none;
            font-weight: 600;
            padding: 8px 16px;
            border: 2px solid #1B1B1B;
            border-radius: 18px;
            background: #FFE55C;
            transition: all 0.3s ease;
            font-size: 0.85rem;
            text-transform: uppercase;
        }
        .nav-links a:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
        
        .social-links { display: flex; gap: 10px; }
        .social-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            border: 3px solid #1B1B1B;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        .social-icon.instagram { background: #E1306C; }
        .social-icon.facebook { background: #1877F2; }
        .social-icon.tiktok { background: #000000; }
        .social-icon.youtube { background: #FF0000; }
        .social-icon:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); }
        
        .masthead {
            background: #333333;
            padding: 60px 0 40px;
            text-align: center;
            color: #fff;
            border-bottom: 4px solid #FFD700;
        }
        
        .masthead h1 {
            display: inline-block;
            background: #333333;
            color: #FFD700;
            font-weight: 900;
            font-size: 2.8rem;
            padding: 20px 40px;
            border-radius: 999px;
            border: 4px solid #FFD700;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
            text-transform: uppercase;
        }
        
        .masthead p {
            margin: 14px auto 0;
            max-width: 720px;
            font-size: 1.3rem;
            font-weight: 700;
            color: #FFD700;
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .content { background: #fdf8f0; padding: 60px 0; }
        
        .section-header {
            margin-bottom: 40px;
            padding-bottom: 24px;
            border-bottom: 3px solid #FFD700;
        }
        
        .section-header h2 {
            font-size: 2.2rem;
            font-weight: 800;
            color: #0F3270;
            margin: 0 0 8px;
            text-transform: uppercase;
        }
        
        .races-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 24px;
        }
        
        .race-card {
            background: white;
            border: 3px solid #FFD700;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
        }
        
        .race-card:hover {
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
            transform: translateY(-2px);
        }
        
        .race-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-bottom: 16px; border-bottom: 2px solid #FFD700; }
        .race-name { font-size: 1.2rem; font-weight: 700; color: #0F3270; margin: 0; flex: 1; }
        .badge { padding: 6px 12px; border-radius: 18px; color: white; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
        .badge-confirmada { background: #00AA00; }
        .badge-programada { background: #FF9900; }
        
        .race-meta { display: flex; gap: 20px; margin-top: 12px; }
        .meta-item { display: flex; align-items: center; gap: 8px; font-weight: 600; }
        
        .participants { padding: 16px; background: #f9f6f0; border-left: 4px solid #FFD700; border-radius: 6px; margin-top: 12px; }
        .participants-list { list-style: none; padding: 0; margin: 8px 0 0; }
        .participant-item { display: flex; justify-content: space-between; font-size: 0.9rem; margin: 6px 0; }
        .corral { background: #FFD700; color: #1B1B1B; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }
        
        .floating-whatsapp {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #25D366, #128C7E);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 28px;
            text-decoration: none;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);
            transition: all 0.3s ease;
            z-index: 999;
        }
        
        .floating-whatsapp:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 8px 20px rgba(37, 211, 102, 0.45);
        }
        
        .footer { background: #333333; color: white; padding: 40px 0; text-align: center; }
        .footer p { margin: 10px 0; color: #ccc; }
        
        @media (max-width: 768px) {
            .races-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-container">
            <div class="brand">🐴 La Montaña</div>
            <nav class="nav-links">
                <a href="/">Inicio</a>
                <a href="/carreras">Carreras</a>
            </nav>
            <div class="social-links">
                <a href="https://www.instagram.com/parquehipicolamontana/" target="_blank" rel="noopener noreferrer" class="social-icon instagram" title="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="https://www.facebook.com/parquehipico/" target="_blank" rel="noopener noreferrer" class="social-icon facebook" title="Facebook"><i class="fab fa-facebook"></i></a>
                <a href="https://www.tiktok.com/@haras.as7" target="_blank" rel="noopener noreferrer" class="social-icon tiktok" title="TikTok"><i class="fab fa-tiktok"></i></a>
                <a href="https://www.youtube.com/@ParquehípicoLaMontaña" target="_blank" rel="noopener noreferrer" class="social-icon youtube" title="YouTube"><i class="fab fa-youtube"></i></a>
            </div>
        </div>
    </header>

    <!-- Masthead -->
    <section class="masthead">
        <div class="container">
            <h1>CARRERAS A LA CHILENA</h1>
            <p>Tradición, adrenalina y familia en cada jornada</p>
        </div>
    </section>

    <!-- Content -->
    <section class="content">
        <div class="container">
            <div class="section-header">
                <h2>📅 Programa de Carreras del Día</h2>
            </div>

            <div class="races-grid">
                <div class="race-card">
                    <div class="race-header">
                        <h3 class="race-name">Carrera de Apertura</h3>
                        <span class="badge badge-confirmada">Confirmada</span>
                    </div>
                    <div class="race-meta">
                        <div class="meta-item">🕐 10:30 hrs</div>
                        <div class="meta-item">📏 300 m</div>
                    </div>
                    <div class="participants">
                        <strong>🐴 Participantes:</strong>
                        <ul class="participants-list">
                            <li class="participant-item">
                                <span>Rayo Azul</span>
                                <span class="corral">A</span>
                            </li>
                            <li class="participant-item">
                                <span>Trueno Negro</span>
                                <span class="corral">B</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="race-card">
                    <div class="race-header">
                        <h3 class="race-name">Segunda Manga</h3>
                        <span class="badge badge-confirmada">Confirmada</span>
                    </div>
                    <div class="race-meta">
                        <div class="meta-item">🕐 11:15 hrs</div>
                        <div class="meta-item">📏 300 m</div>
                    </div>
                    <div class="participants">
                        <strong>🐴 Participantes:</strong>
                        <ul class="participants-list">
                            <li class="participant-item">
                                <span>La Montaña</span>
                                <span class="corral">C</span>
                            </li>
                            <li class="participant-item">
                                <span>Viento Sur</span>
                                <span class="corral">D</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="race-card">
                    <div class="race-header">
                        <h3 class="race-name">Tercera Carrera</h3>
                        <span class="badge badge-programada">Programada</span>
                    </div>
                    <div class="race-meta">
                        <div class="meta-item">🕐 12:00 hrs</div>
                        <div class="meta-item">📏 350 m</div>
                    </div>
                    <div class="participants">
                        <strong>🐴 Participantes:</strong>
                        <ul class="participants-list">
                            <li class="participant-item">
                                <span>Corcel Rápido</span>
                                <span class="corral">B</span>
                            </li>
                            <li class="participant-item">
                                <span>Jinete Mayor</span>
                                <span class="corral">E</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="race-card">
                    <div class="race-header">
                        <h3 class="race-name">Carrera Especial</h3>
                        <span class="badge badge-confirmada">Confirmada</span>
                    </div>
                    <div class="race-meta">
                        <div class="meta-item">🕐 13:30 hrs</div>
                        <div class="meta-item">📏 300 m</div>
                    </div>
                    <div class="participants">
                        <strong>🐴 Participantes:</strong>
                        <ul class="participants-list">
                            <li class="participant-item">
                                <span>Fuego del Sur</span>
                                <span class="corral">A</span>
                            </li>
                            <li class="participant-item">
                                <span>Caballero Oscuro</span>
                                <span class="corral">C</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p><strong>Dirección:</strong> NANCAHUE, S-743, PC G, LONCOCHE, Loncoche, Araucanía, Chile</p>
            <p><strong>Teléfono:</strong> +56 9 7163 6195</p>
            <p><strong>Email:</strong> parquehipicolamontana@gmail.com</p>
            <p><strong>Copyright:</strong> © 2025 Parque Hípico La Montaña. Desarrollado por Eleit</p>
        </div>
    </footer>

    <!-- Botón flotante WhatsApp -->
    <a href="https://wa.me/56971636195?text=Hola,%20quiero%20coordinar%20carreras%20y%20eventos%20en%20Parque%20H%C3%ADpico%20La%20Monta%C3%B1a." target="_blank" rel="noopener noreferrer" class="floating-whatsapp" title="Coordinar por WhatsApp">
        💬
    </a>
</body>
</html>
  `);
});

// 404
app.use((req, res) => {
  res.status(404).send(`
    <html>
    <head>
        <title>404</title>
        <style>
            body { font-family: Arial; background: #fdf8f0; }
            .container { max-width: 600px; margin: 100px auto; text-align: center; }
            h1 { color: #0F3270; font-size: 3rem; }
            p { font-size: 1.2rem; color: #666; }
            a { color: #FFD700; text-decoration: none; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>404</h1>
            <p>Página no encontrada</p>
            <p><a href="/">← Volver al inicio</a></p>
        </div>
    </body>
    </html>
  `);
});

// Escuchar
app.listen(PORT, () => {
  console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
  console.log(`📄 Inicio: http://localhost:${PORT}/`);
  console.log(`📅 Carreras: http://localhost:${PORT}/carreras`);
});




