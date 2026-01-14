# 🛡️ Panel de Administración - Parque Hípico La Montaña

## Diagrama del Sistema

![Diagrama del panel de administración](C:/Users/alber/.gemini/antigravity/brain/e40973a5-a22d-4063-afeb-9222f5f266a8/admin_panel_diagram_1768409363079.png)

---

## Roles de Usuario

### 👤 STAFF
Personal administrativo que puede:
- ✅ Generar invitaciones con QR
- ✅ Ver lista de asistentes
- ✅ Compartir invitaciones por WhatsApp
- ✅ Acceder al dashboard

### 🛡️ GUARDIA
Personal de seguridad en la entrada que puede:
- ✅ Escanear QR codes
- ✅ Validar tickets
- ✅ Marcar tickets como "usado"

---

## Flujo del Staff

### 1. Inicio de Sesión
- Accede a `parquehipico.cl/login`
- Ingresa usuario y contraseña
- El sistema valida el rol (staff/guardia)

### 2. Generar Invitación
Desde `parquehipico.cl/admin/invitaciones`:
- Ingresa el **nombre del invitado**
- Selecciona el **tipo de ticket** (VIP, General, etc.)
- Click en **"Generar Invitación"**
- El sistema crea un código QR único
- Se guarda en Supabase con estado `pagado`

### 3. Compartir por WhatsApp
- Se genera una **imagen** con:
  - Logo del evento
  - Nombre del invitado
  - Código QR
- Click en **"Compartir por WhatsApp"**
- Se abre WhatsApp con la imagen lista para enviar

### 4. Ver Dashboard
Desde `parquehipico.cl/admin/dashboard`:
- Ver **total de tickets vendidos**
- Ver **tickets usados vs pendientes**
- Estadísticas del evento

### 5. Lista de Asistentes
Desde `parquehipico.cl/admin/lista`:
- Ver tabla con todos los tickets
- Filtrar por estado (pagado/usado)
- Ver fecha y hora de cada entrada

---

## Flujo del Guardia

### 1. Acceder al Scanner
- Ingresa a `parquehipico.cl/admin/scan`
- Se solicita permiso de cámara

### 2. Escanear QR
- Apunta la cámara al código QR del ticket
- El sistema lee el código automáticamente

### 3. Verificar Ticket
El sistema busca el código en Supabase:

| Estado Actual | Resultado |
|---------------|-----------|
| `pagado` | ✅ **VÁLIDO** - Se puede ingresar |
| `usado` | ❌ **YA USADO** - No puede ingresar |
| No existe | ❌ **INVÁLIDO** - Ticket falso |

### 4. Marcar como Usado
Si el ticket es válido:
- Se actualiza el estado a `usado`
- Se guarda la fecha/hora de entrada
- El guardia ve pantalla verde de confirmación

### 5. Siguiente Escaneo
- Click en **"Escanear Siguiente"**
- La cámara se reinicia para el próximo ticket

---

## Pantallas del Sistema

| URL | Función |
|-----|---------|
| `/login` | Inicio de sesión |
| `/admin` | Panel principal |
| `/admin/invitaciones` | Generar invitaciones |
| `/admin/scan` | Escanear QR codes |
| `/admin/lista` | Ver todos los tickets |
| `/admin/dashboard` | Estadísticas |

---

## Estados de un Ticket

```
┌─────────────┐    Compra/Invitación    ┌─────────────┐
│   (nuevo)   │ ────────────────────▶  │   PAGADO    │
└─────────────┘                         └─────────────┘
                                              │
                                              │ Escaneo QR
                                              ▼
                                        ┌─────────────┐
                                        │    USADO    │
                                        └─────────────┘
```

---

## Seguridad

- **Autenticación:** Login con usuario/contraseña
- **Roles:** Diferentes permisos para staff y guardia
- **QR únicos:** Cada ticket tiene código irrepetible
- **Protección doble uso:** Un ticket solo puede usarse una vez
- **Sin navbar público:** El panel admin no muestra el menú de la web pública

---

## Base de Datos

La tabla `tickets` almacena:

| Campo | Descripción |
|-------|-------------|
| `codigo_qr` | Código único del ticket |
| `nombre_cliente` | Nombre del asistente |
| `estado` | 'pagado' o 'usado' |
| `evento` | Nombre del evento |
| `created_at` | Fecha de creación |

---

*Documento generado el 14 de enero de 2026*
