# Parque Hípico La Montaña

Sitio oficial del **Parque Hípico La Montaña** — un espacio para vivir la hípica, la entretención familiar y los grandes eventos en la Araucanía.

## 🐎 Sobre el proyecto

Este repositorio contiene la **landing institucional** del Parque Hípico La Montaña.  
Está desarrollada en **HTML + CSS + JavaScript**, es **responsive**, y está preparada para desplegarse en **Cloudflare Pages**.

## ✨ Funcionalidades principales

- **Header con mega-menú** (5 casillas):
  - **Parque Hípico** (Visión y misión, Características del parque, Ubicación, Seguridad, Estacionamientos)
  - **Carreras** (Fechas disponibles, Inscripciones, Premios, Apuestas, Últimos ganadores)
  - **Entretención** (Experiencia hípica, Gastronomía, Entorno familiar, Música, Tiendas)
  - **Renta Eventos** (Tipos de evento, Qué ofrecemos, Cotizar)
  - **Colabora con Nosotros** (Artistas, Oferta culinaria, Comercio, Patrocinios, Otros)
- **Redes sociales** en el encabezado (Instagram y Facebook con sus colores y enlaces oficiales).
- **Carrusel de eventos** (auto-rotación cada 5s, con leyenda).
- **Calendario interactivo**:
  - Navegación de meses (anterior/siguiente)
  - Fechas con evento resaltadas en **rojo** y clicables
- **Próximas fechas**: lista automática de los **3** próximos eventos.
- **Resumen de secciones** (bloques tipo footer) con enlaces internos.
- **Footer institucional** con información de contacto, copyright y enlaces legales.

## 🎨 Identidad visual

- **Fondo principal:** Amarillo brillante `#FFD700`
- **Texto:** Azul intenso `#001F5B`
- **Acentos / hover / eventos:** Rojo brillante `#FF0000`
- **Estructura y secciones:** Grises `#333333` / `#777777`
- **Tipografía:** `Montserrat` (Google Fonts)

## 🛠️ Tecnologías

- **HTML5** (semántico y accesible)
- **CSS3** (Flexbox + Grid)
- **JavaScript** (carrusel, calendario, próximas fechas)
- **Cloudflare Pages** (deploy)

## 📁 Estructura

```
parquehipico/
├── index.html # Estructura principal (header, carrusel, secciones y footer)
├── styles.css # Estilos (colores institucionales, layout responsive)
├── script.js # Carrusel, calendario y próximas fechas
└── README.md # Este documento
```

## 🚀 Uso local

1. Clona el repo y abre el proyecto:
   ```bash
   git clone https://github.com/weareleit-sys/parquehipico.git
   cd parquehipico
   ```
2. Abre `index.html` en tu navegador.

El calendario trae ejemplos de eventos en `script.js` dentro del objeto `EVENTS`.
Formato de fecha: YYYY-MM-DD.

```js
const EVENTS = {
  "2025-10-12": { title: "Jornada de Carreras", url: "#evento-carreras-12oct" },
  // ...
};
```

## ☁️ Deploy (Cloudflare Pages)

Este proyecto está listo para desplegarse con Cloudflare Pages:

- Conecta el repositorio en Cloudflare Pages.
- Configura la rama `main` como producción.
- No requiere build (sitio estático).
- Cada git push a `main` publica automáticamente.

## 🔗 Redes oficiales

- Instagram:  
  https://www.instagram.com/parquehipicolamontana/  
  https://www.instagram.com/parque_hipico_/
- Facebook:  
  https://www.facebook.com/parquehipico/

## 📍 Contacto

- **Dirección:** NANCAHUE, S-743, PC G, LONCOCHE, Loncoche, Araucanía, Chile
- **Teléfono:** +56 9 7163 6195
- **Email:** parquehipicolamontana@gmail.com

## 📄 Licencia

© 2025 Parque Hípico La Montaña. Desarrollado por Eleit.  
Todos los derechos reservados.
