// Servidor simple para probar la página de Carreras a la Chilena
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log(`Solicitud: ${req.url}`);

  if (req.url === '/carreras') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carreras a la Chilena | Parque Hípico La Montaña</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --azul: #0F3270;
            --amarillo: #FFD700;
            --negro: #1B1B1B;
            --spacing-lg: 16px;
            --spacing-2xl: 28px;
            --spacing-3xl: 40px;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: #fdf8f0;
            color: #1B1B1B;
        }

        .header {
            background-color: #FFD700;
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
            gap: 24px;
        }

        .brand {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1B1B1B;
        }

        .nav {
            flex: 1;
            display: flex;
            justify-content: center;
            gap: 20px;
        }

        .nav a {
            color: #1B1B1B;
            text-decoration: none;
            font-weight: 600;
            padding: 10px 15px;
            border: 2px solid #1B1B1B;
            border-radius: 18px;
            background: #FFE55C;
            box-shadow: 0 3px 0 #1B1B1B;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            text-transform: uppercase;
        }

        .nav a:hover {
            transform: translateY(1px);
            box-shadow: 0 2px 0 #1B1B1B;
        }

        .masthead {
            background: #333333;
            padding: 60px 0 40px;
            text-align: center;
            color: #fff;
            border-bottom: 4px solid var(--amarillo);
        }

        .masthead-title {
            display: inline-block;
            background: #333333;
            color: var(--amarillo);
            font-weight: 900;
            font-size: 2.8rem;
            line-height: 1.1;
            letter-spacing: 1px;
            padding: 20px 40px;
            border-radius: 999px;
            border: 4px solid var(--amarillo);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
            text-transform: uppercase;
        }

        .masthead-subtitle {
            margin: 14px auto 8px;
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--amarillo);
            letter-spacing: 0.3px;
        }

        .masthead-description {
            font-size: 1rem;
            color: #ddd;
            font-weight: 500;
        }

        .content {
            background: #fdf8f0;
            padding: 60px 0;
            min-height: calc(100vh - 300px);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .section-header {
            margin-bottom: 40px;
            padding-bottom: 24px;
            border-bottom: 3px solid var(--amarillo);
        }

        .section-title {
            font-size: 2.2rem;
            font-weight: 800;
            color: var(--azul);
            margin: 0 0 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .section-description {
            font-size: 1rem;
            color: #666;
            margin: 0;
            line-height: 1.5;
            max-width: 700px;
        }

        .races-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 24px;
            margin-bottom: 60px;
        }

        .race-card {
            background: white;
            border: 3px solid var(--amarillo);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .race-card:hover {
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
            transform: translateY(-2px);
        }

        .race-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
            padding-bottom: 16px;
            border-bottom: 2px solid var(--amarillo);
        }

        .race-name {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--azul);
            margin: 0;
            flex: 1;
        }

        .badge {
            padding: 6px 12px;
            border-radius: 18px;
            color: white;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .badge-confirmada { background: #00AA00; }
        .badge-programada { background: #FF9900; }
        .badge-suspendida { background: #FF0000; }

        .race-meta {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.95rem;
            color: var(--negro);
            font-weight: 600;
        }

        .meta-icon {
            font-size: 1.2rem;
            line-height: 1;
        }

        .participants {
            padding: 16px;
            background: #f9f6f0;
            border-left: 4px solid var(--amarillo);
            border-radius: 6px;
        }

        .participants-title {
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--azul);
            margin: 0 0 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .participants-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .participant-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.9rem;
            gap: 12px;
        }

        .horse-name {
            font-weight: 700;
            color: var(--negro);
            flex: 1;
        }

        .corral {
            font-size: 0.75rem;
            background: var(--amarillo);
            color: var(--negro);
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: 600;
            white-space: nowrap;
        }

        .notes {
            padding: 16px;
            background: #fffbf0;
            border-left: 3px solid var(--amarillo);
            border-radius: 6px;
            font-size: 0.85rem;
            color: #666;
            margin: 0;
            font-style: italic;
            line-height: 1.5;
        }

        /* Sección de ganadores */
        .winners-section {
            margin-top: 60px;
            padding: 28px;
            background: white;
            border: 3px solid var(--amarillo);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .winners-header {
            margin-bottom: 28px;
            padding-bottom: 16px;
            border-bottom: 3px solid var(--amarillo);
        }

        .winners-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--azul);
            margin: 0 0 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .winners-subtitle {
            font-size: 0.95rem;
            color: #666;
            margin: 0;
            font-weight: 500;
        }

        .winners-table {
            width: 100%;
            border-collapse: collapse;
        }

        .winners-table thead {
            background: #f9f6f0;
            border-bottom: 3px solid var(--amarillo);
        }

        .winners-table th {
            padding: 14px 16px;
            text-align: left;
            font-weight: 700;
            color: var(--azul);
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .winners-table tbody tr {
            border-bottom: 1px solid #e0e0e0;
            transition: background-color 0.2s ease;
        }

        .winners-table tbody tr:hover {
            background: #fffbf0;
        }

        .winners-table td {
            padding: 12px 16px;
            font-size: 0.9rem;
            color: var(--negro);
            vertical-align: middle;
        }

        .horse-winner {
            font-weight: 700;
            color: var(--azul);
        }

        /* Sección de feedback */
        .feedback-section {
            margin-top: 60px;
            padding: 28px;
            background: white;
            border: 3px solid var(--amarillo);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .feedback-header {
            margin-bottom: 28px;
            padding-bottom: 16px;
            border-bottom: 3px solid var(--amarillo);
        }

        .feedback-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--azul);
            margin: 0 0 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .feedback-subtitle {
            font-size: 0.95rem;
            color: #666;
            margin: 0;
            font-weight: 500;
        }

        .stars-container {
            display: flex;
            gap: 12px;
            margin: 20px 0;
        }

        .star-btn {
            background: none;
            border: none;
            font-size: 2.5rem;
            cursor: pointer;
            opacity: 0.3;
            transition: all 0.2s ease;
            padding: 8px;
            border-radius: 8px;
        }

        .star-btn:hover, .star-btn.active {
            opacity: 1;
            transform: scale(1.1);
            background: rgba(255, 215, 0, 0.2);
        }

        .feedback-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .form-label {
            font-weight: 700;
            color: var(--azul);
            text-transform: uppercase;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
        }

        .textarea {
            padding: 16px;
            border: 2px solid var(--amarillo);
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 0.9rem;
            color: var(--negro);
            background: white;
            resize: vertical;
        }

        .textarea:focus {
            outline: none;
            border-color: var(--azul);
            box-shadow: 0 0 0 3px rgba(15, 50, 112, 0.1);
        }

        .submit-btn {
            background: var(--amarillo);
            color: var(--negro);
            border: 3px solid var(--negro);
            padding: 14px 24px;
            border-radius: 18px;
            font-weight: 700;
            font-size: 0.95rem;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 0 4px 0 var(--negro);
            transition: all 0.3s ease;
            width: 100%;
            max-width: 300px;
            letter-spacing: 0.5px;
        }

        .submit-btn:hover {
            transform: translateY(2px);
            box-shadow: 0 2px 0 var(--negro);
        }

        /* Botón flotante de WhatsApp */
        .floating-whatsapp {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 999;
            width: 56px;
            height: 56px;
            background: var(--amarillo);
            border: 3px solid var(--negro);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #25D366;
            font-size: 28px;
            text-decoration: none;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
            transition: all 0.3s ease;
        }

        .floating-whatsapp:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(37, 211, 102, 0.4);
        }

        .footer {
            background: #333333;
            color: white;
            padding: 40px 0;
            text-align: center;
            margin-top: 60px;
        }

        .footer p {
            margin-bottom: 10px;
            font-size: 0.95rem;
            color: #ccc;
        }

        .footer strong {
            color: var(--amarillo);
        }

        @media (max-width: 768px) {
            .races-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .section-title {
                font-size: 1.5rem;
            }

            .masthead-title {
                font-size: 1.8rem;
                padding: 14px 24px;
                border-width: 3px;
            }

            .winners-table {
                font-size: 0.85rem;
            }

            .winners-table th, .winners-table td {
                padding: 10px 12px;
            }
        }

        @media (max-width: 640px) {
            .masthead {
                padding: 30px 0 20px;
            }

            .masthead-title {
                font-size: 1.5rem;
                padding: 10px 16px;
                border-width: 2px;
            }

            .section-title {
                font-size: 1.3rem;
            }

            .races-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-container">
            <div class="brand">🐴 La Montaña</div>
            <nav class="nav">
                <a href="/">Inicio</a>
                <a href="#carreras">Carreras</a>
            </nav>
        </div>
    </header>

    <!-- Masthead -->
    <section class="masthead">
        <div class="container">
            <h1 class="masthead-title">CARRERAS A LA CHILENA</h1>
            <p class="masthead-subtitle">Tradición, adrenalina y familia en cada jornada</p>
            <p class="masthead-description">Hoy, 28 de noviembre | 8 carreras confirmadas</p>
        </div>
    </section>

    <!-- Content -->
    <section class="content">
        <div class="container">
            <!-- Sección de carreras -->
            <div class="section-header">
                <h2 class="section-title">📅 Programa de Carreras del Día</h2>
                <p class="section-description">Las carreras se coordinan por teléfono o WhatsApp. Haz clic en el botón flotante para coordinar con el parque.</p>
            </div>

            <div class="races-grid">
                <!-- Carrera 1 -->
                <div class="race-card">
                    <div class="race-header">
                        <h3 class="race-name">Carrera de Apertura</h3>
                        <span class="badge badge-confirmada">Confirmada</span>
                    </div>
                    <div class="race-meta">
                        <div class="meta-item">
                            <span class="meta-icon">🕐</span>
                            <span>10:30 hrs</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">📏</span>
                            <span>300 m</span>
                        </div>
                    </div>
                    <div class="participants">
                        <h4 class="participants-title">🐴 Participantes</h4>
                        <ul class="participants-list">
                            <li class="participant-item">
                                <span class="horse-name">Rayo Azul</span>
                                <span class="corral">A</span>
                            </li>
                            <li class="participant-item">
                                <span class="horse-name">Trueno Negro</span>
                                <span class="corral">B</span>
                            </li>
                        </ul>
                    </div>
                    <p class="notes">Premios pactados entre corrales. Cancha facilitada por el Parque.</p>
                </div>

                <!-- Carrera 2 -->
                <div class="race-card">
                    <div class="race-header">
                        <h3 class="race-name">Segunda Manga</h3>
                        <span class="badge badge-confirmada">Confirmada</span>
                    </div>
                    <div class="race-meta">
                        <div class="meta-item">
                            <span class="meta-icon">🕐</span>
                            <span>11:15 hrs</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">📏</span>
                            <span>300 m</span>
                        </div>
                    </div>
                    <div class="participants">
                        <h4 class="participants-title">🐴 Participantes</h4>
                        <ul class="participants-list">
                            <li class="participant-item">
                                <span class="horse-name">La Montaña</span>
                                <span class="corral">C</span>
                            </li>
                            <li class="participant-item">
                                <span class="horse-name">Viento Sur</span>
                                <span class="corral">D</span>
                            </li>
                            <li class="participant-item">
                                <span class="horse-name">Estrella Dorada</span>
                                <span class="corral">A</span>
                            </li>
                        </ul>
                    </div>
                    <p class="notes">Participan 3 caballos. Ganador lleva premiación en especies.</p>
                </div>

                <!-- Carrera 3 -->
                <div class="race-card">
                    <div class="race-header">
                        <h3 class="race-name">Tercera Carrera</h3>
                        <span class="badge badge-programada">Programada</span>
                    </div>
                    <div class="race-meta">
                        <div class="meta-item">
                            <span class="meta-icon">🕐</span>
                            <span>12:00 hrs</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">📏</span>
                            <span>350 m</span>
                        </div>
                    </div>
                    <div class="participants">
                        <h4 class="participants-title">🐴 Participantes</h4>
                        <ul class="participants-list">
                            <li class="participant-item">
                                <span class="horse-name">Corcel Rápido</span>
                                <span class="corral">B</span>
                            </li>
                            <li class="participant-item">
                                <span class="horse-name">Jinete Mayor</span>
                                <span class="corral">E</span>
                            </li>
                        </ul>
                    </div>
                    <p class="notes">A mayor distancia. Confirmación sujeta a condiciones del terreno.</p>
                </div>

                <!-- Carrera 4 -->
                <div class="race-card">
                    <div class="race-header">
                        <h3 class="race-name">Carrera Especial</h3>
                        <span class="badge badge-confirmada">Confirmada</span>
                    </div>
                    <div class="race-meta">
                        <div class="meta-item">
                            <span class="meta-icon">🕐</span>
                            <span>13:30 hrs</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">📏</span>
                            <span>300 m</span>
                        </div>
                    </div>
                    <div class="participants">
                        <h4 class="participants-title">🐴 Participantes</h4>
                        <ul class="participants-list">
                            <li class="participant-item">
                                <span class="horse-name">Fuego del Sur</span>
                                <span class="corral">A</span>
                            </li>
                            <li class="participant-item">
                                <span class="horse-name">Caballero Oscuro</span>
                                <span class="corral">C</span>
                            </li>
                            <li class="participant-item">
                                <span class="horse-name">Luna Blanca</span>
                                <span class="corral">D</span>
                            </li>
                        </ul>
                    </div>
                    <p class="notes">Con premio mayor. Coordinada directamente con los corrales.</p>
                </div>

                <!-- Carrera 5 -->
                <div class="race-card">
                    <div class="race-header">
                        <h3 class="race-name">Manga del Mediodía</h3>
                        <span class="badge badge-confirmada">Confirmada</span>
                    </div>
                    <div class="race-meta">
                        <div class="meta-item">
                            <span class="meta-icon">🕐</span>
                            <span>14:15 hrs</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">📏</span>
                            <span>300 m</span>
                        </div>
                    </div>
                    <div class="participants">
                        <h4 class="participants-title">🐴 Participantes</h4>
                        <ul class="participants-list">
                            <li class="participant-item">
                                <span class="horse-name">Don Toro</span>
                                <span class="corral">E</span>
                            </li>
                            <li class="participant-item">
                                <span class="horse-name">Silvestre</span>
                                <span class="corral">B</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Carrera 6 -->
                <div class="race-card">
                    <div class="race-header">
                        <h3 class="race-name">Desafío del Parque</h3>
                        <span class="badge badge-suspendida">Suspendida</span>
                    </div>
                    <div class="race-meta">
                        <div class="meta-item">
                            <span class="meta-icon">🕐</span>
                            <span>15:00 hrs</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">📏</span>
                            <span>400 m</span>
                        </div>
                    </div>
                    <div class="participants">
                        <h4 class="participants-title">🐴 Participantes</h4>
                        <ul class="participants-list">
                            <li class="participant-item">
                                <span class="horse-name">Rey Negro</span>
                                <span class="corral">A</span>
                            </li>
                            <li class="participant-item">
                                <span class="horse-name">Príncipe Dorado</span>
                                <span class="corral">F</span>
                            </li>
                        </ul>
                    </div>
                    <p class="notes">Suspendida temporalmente por mantenimiento de cancha.</p>
                </div>

                <!-- Carrera 7 -->
                <div class="race-card">
                    <div class="race-header">
                        <h3 class="race-name">Carrera del Anochecer</h3>
                        <span class="badge badge-programada">Programada</span>
                    </div>
                    <div class="race-meta">
                        <div class="meta-item">
                            <span class="meta-icon">🕐</span>
                            <span>16:30 hrs</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">📏</span>
                            <span>300 m</span>
                        </div>
                    </div>
                    <div class="participants">
                        <h4 class="participants-title">🐴 Participantes</h4>
                        <ul class="participants-list">
                            <li class="participant-item">
                                <span class="horse-name">Sombra Rápida</span>
                                <span class="corral">C</span>
                            </li>
                            <li class="participant-item">
                                <span class="horse-name">Visiño Veloz</span>
                                <span class="corral">A</span>
                            </li>
                            <li class="participant-item">
                                <span class="horse-name">Caballo Criollo</span>
                                <span class="corral">D</span>
                            </li>
                        </ul>
                    </div>
                    <p class="notes">Última carrera de la jornada. Premios acumulables.</p>
                </div>

                <!-- Carrera 8 -->
                <div class="race-card">
                    <div class="race-header">
                        <h3 class="race-name">Gran Clásico Vespertino</h3>
                        <span class="badge badge-confirmada">Confirmada</span>
                    </div>
                    <div class="race-meta">
                        <div class="meta-item">
                            <span class="meta-icon">🕐</span>
                            <span>17:15 hrs</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">📏</span>
                            <span>400 m</span>
                        </div>
                    </div>
                    <div class="participants">
                        <h4 class="participants-title">🐴 Participantes</h4>
                        <ul class="participants-list">
                            <li class="participant-item">
                                <span class="horse-name">Patriota</span>
                                <span class="corral">B</span>
                            </li>
                            <li class="participant-item">
                                <span class="horse-name">Guapo</span>
                                <span class="corral">E</span>
                            </li>
                        </ul>
                    </div>
                    <p class="notes">Carrera estelar. Máxima asistencia esperada.</p>
                </div>
            </div>

            <!-- Últimos ganadores -->
            <section class="winners-section">
                <div class="winners-header">
                    <h2 class="winners-title">🏆 Últimos Ganadores</h2>
                    <p class="winners-subtitle">Registro histórico de los campeones en nuestras carreras</p>
                </div>
                <table class="winners-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Carrera</th>
                            <th>Caballo Ganador</th>
                            <th>Corral</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>28-11-2025</td>
                            <td>Carrera de Apertura</td>
                            <td class="horse-winner">Rayo Azul</td>
                            <td><span class="corral">A</span></td>
                        </tr>
                        <tr>
                            <td>28-11-2025</td>
                            <td>Segunda Manga</td>
                            <td class="horse-winner">La Montaña</td>
                            <td><span class="corral">C</span></td>
                        </tr>
                        <tr>
                            <td>21-11-2025</td>
                            <td>Clásico Noviembre</td>
                            <td class="horse-winner">Trueno Negro</td>
                            <td><span class="corral">B</span></td>
                        </tr>
                        <tr>
                            <td>21-11-2025</td>
                            <td>Carrera Especial</td>
                            <td class="horse-winner">Viento Sur</td>
                            <td><span class="corral">D</span></td>
                        </tr>
                        <tr>
                            <td>14-11-2025</td>
                            <td>Primera de la Jornada</td>
                            <td class="horse-winner">Estrella Dorada</td>
                            <td><span class="corral">A</span></td>
                        </tr>
                        <tr>
                            <td>14-11-2025</td>
                            <td>Desafío del Parque</td>
                            <td class="horse-winner">Corcel Rápido</td>
                            <td><span class="corral">B</span></td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- Feedback -->
            <section class="feedback-section">
                <div class="feedback-header">
                    <h2 class="feedback-title">¿Qué te parecieron las carreras?</h2>
                    <p class="feedback-subtitle">Tu opinión nos ayuda a mejorar cada jornada</p>
                </div>
                <form class="feedback-form" onsubmit="handleFeedbackSubmit(event)">
                    <div class="form-group">
                        <label class="form-label">Calificación *</label>
                        <div class="stars-container" id="starsContainer"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Comentario (opcional)</label>
                        <textarea class="textarea" placeholder="Cuéntanos qué te gustó o qué podemos mejorar..." rows="4" maxlength="500" id="commentInput"></textarea>
                        <small style="color: #999; text-align: right; margin-top: 4px;">
                            <span id="charCount">0</span>/500 caracteres
                        </small>
                    </div>
                    <button type="submit" class="submit-btn">📤 Enviar Opinión</button>
                </form>
            </section>
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

    <!-- Botón flotante de WhatsApp -->
    <a href="https://wa.me/56971636195?text=Hola,%20quiero%20coordinar%20carreras%20a%20la%20chilena%20en%20La%20Montaña." target="_blank" class="floating-whatsapp" title="Coordinar por WhatsApp">
        💬
    </a>

    <script>
        // Inicializar estrellas
        const starsContainer = document.getElementById('starsContainer');
        let selectedRating = 0;

        for (let i = 1; i <= 5; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'star-btn';
            btn.textContent = '⭐';
            btn.addEventListener('click', () => { selectedRating = i; updateStars(); });
            btn.addEventListener('mouseenter', () => {
                starsContainer.querySelectorAll('.star-btn').forEach((b, idx) => {
                    b.classList.toggle('active', idx < i);
                });
            });
            starsContainer.appendChild(btn);
        }

        starsContainer.addEventListener('mouseleave', updateStars);

        function updateStars() {
            starsContainer.querySelectorAll('.star-btn').forEach((b, idx) => {
                b.classList.toggle('active', idx < selectedRating);
            });
        }

        // Contador de caracteres
        const commentInput = document.getElementById('commentInput');
        const charCount = document.getElementById('charCount');
        commentInput.addEventListener('input', () => {
            charCount.textContent = commentInput.value.length;
        });

        // Enviar feedback
        function handleFeedbackSubmit(e) {
            e.preventDefault();
            if (selectedRating === 0) {
                alert('Por favor selecciona una calificación');
                return;
            }

            const feedbackData = {
                rating: selectedRating,
                comment: commentInput.value,
                timestamp: new Date().toISOString()
            };

            const storedFeedback = localStorage.getItem('raceFeedback') || '[]';
            const feedbackList = JSON.parse(storedFeedback);
            feedbackList.push(feedbackData);
            localStorage.setItem('raceFeedback', JSON.stringify(feedbackList));

            alert('¡Gracias por tu opinión! Hemos registrado tu calificación.');
            selectedRating = 0;
            commentInput.value = '';
            charCount.textContent = '0';
            updateStars();
        }
    </script>
</body>
</html>
    `);
  } else if (req.url === '/' || req.url === '/index.html') {
    // Página de inicio
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parque Hípico La Montaña</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background: #fdf8f0; }
        .header { background: #FFD700; padding: 20px; text-align: center; }
        .header h1 { font-size: 2rem; color: #1B1B1B; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .links { display: flex; gap: 20px; justify-content: center; margin-top: 40px; }
        a { background: #0F3270; color: #FFD700; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; }
        a:hover { opacity: 0.8; }
    </style>
</head>
<body>
    <header class="header">
        <h1>🐴 Parque Hípico La Montaña</h1>
    </header>
    <div class="container">
        <h2 style="color: #0F3270; text-align: center;">Bienvenido</h2>
        <p style="text-align: center; color: #666; margin: 20px 0;">
            Proyecto de demostración de Carreras a la Chilena
        </p>
        <div class="links">
            <a href="/carreras">📅 Ver Carreras</a>
        </div>
    </div>
</body>
</html>
    `);
  } else if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parque Hípico La Montaña</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background: #fdf8f0; }
        .header { background: #FFD700; padding: 20px; text-align: center; }
        .header h1 { font-size: 2rem; color: #1B1B1B; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .links { display: flex; gap: 20px; justify-content: center; margin-top: 40px; }
        a { background: #0F3270; color: #FFD700; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; }
        a:hover { opacity: 0.8; }
    </style>
</head>
<body>
    <header class="header">
        <h1>🐴 Parque Hípico La Montaña</h1>
    </header>
    <div class="container">
        <h2 style="color: #0F3270; text-align: center;">Bienvenido</h2>
        <p style="text-align: center; color: #666; margin: 20px 0;">
            Sitio oficial - Proyecto Next.js
        </p>
        <div class="links">
            <a href="/carreras">📅 Ver Carreras</a>
        </div>
    </div>
</body>
</html>
    `);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 - Página no encontrada</h1>');
  }
});

server.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
  console.log(`📅 Ir a: http://localhost:${PORT}/carreras`);
});
