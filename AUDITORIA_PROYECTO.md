# 📋 AUDITORÍA DEL PROYECTO - Parque Hípico La Montaña

## 🔴 PROBLEMAS IDENTIFICADOS

### 1. **Duplicación de archivos**
- ❌ `FloatingWhatsAppButton.tsx` aparece en:
  - `app/components/FloatingWhatsAppButton/` (carpeta)
  - `app/components/` (suelta)

- ❌ `FloatingWhatsAppButton.module.css` aparece en:
  - `app/components/FloatingWhatsAppButton/` (carpeta)
  - `app/components/` (suelta)

- ❌ Carpeta `eventos` aparece en:
  - `app/eventos/` (raíz)
  - `app/(routes)/eventos/` (dentro de rutas)

### 2. **Estructura confusa**
- ❌ Carpeta `(routes)` no debería existir
- ❌ Rutas deberían estar directamente en `app/`
- ❌ Archivos sueltos sin carpetas padre

### 3. **Landing page inestable**
- ❌ `app/page.tsx` cambia constantemente
- ❌ No hay versión estable almacenada
- ❌ Componentes importados inconsistentemente

### 4. **Componentes desorganizados**
- ❌ `components/` es un caos
- ❌ Falta jerarquía clara
- ❌ Estilos y componentes no siempre juntos

---

## ✅ ESTRUCTURA CORRECTA PROPUESTA

```
app/
├── page.tsx ........................ HOME (ESTABLE, NO MODIFICAR)
├── layout.tsx ..................... Layout global con FloatingWhatsApp
├── globals.css .................... Estilos globales
│
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── Header.module.css
│   │   ├── Navigation.tsx
│   │   ├── Navigation.module.css
│   │   ├── SocialLinks.tsx
│   │   └── SocialLinks.module.css
│   │
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   └── Footer.module.css
│   │
│   ├── FloatingWhatsApp/
│   │   ├── FloatingWhatsAppButton.tsx
│   │   └── FloatingWhatsAppButton.module.css
│   │
│   ├── carreras/
│   │   ├── RaceCard.tsx
│   │   ├── RaceCard.module.css
│   │   ├── LastWinnersSection.tsx
│   │   ├── LastWinnersSection.module.css
│   │   ├── RaceFeedbackSection.tsx
│   │   └── RaceFeedbackSection.module.css
│   │
│   └── (otros componentes futuros)
│
├── (routes)/
│   └── (ELIMINAR - usar directamente en app/)
│
├── carreras/
│   ├── page.tsx .................. Página de carreras
│   └── carreras.module.css ....... Estilos
│
├── eventos/
│   ├── page.tsx .................. Página de eventos
│   └── eventos.module.css ........ Estilos
│
├── lib/
│   ├── types/
│   │   ├── carreras.ts
│   │   └── (otros tipos)
│   │
│   └── utils/
│       └── (funciones auxiliares)
│
└── api/ (Futuro)
    └── (API routes aquí)
```

---

## 🎯 ACCIONES NECESARIAS

1. **Eliminar duplicados:**
   - [ ] Borrar carpeta `app/(routes)/`
   - [ ] Borrar archivos sueltos duplicados

2. **Reorganizar componentes:**
   - [ ] Mover `Header/Navigation/SocialLinks` a `components/Header/`
   - [ ] Mover `FloatingWhatsApp` a `components/FloatingWhatsApp/`
   - [ ] Mover componentes de carreras a `components/carreras/`

3. **Estabilizar landing:**
   - [ ] Crear versión final de `app/page.tsx`
   - [ ] NO modificar durante sesión de desarrollo

4. **Limpiar imports:**
   - [ ] Actualizar todos los imports en `layout.tsx`
   - [ ] Verificar que no haya imports rotos

---

## 📊 ESTADO ACTUAL

| Aspecto | Estado | Acción |
|---------|--------|--------|
| Landing Page | ❌ Inestable | Crear versión final |
| Componentes | ❌ Desorganizados | Reorganizar en carpetas |
| Rutas | ❌ Confusas | Eliminar `(routes)` |
| Duplicados | ❌ Existen | Eliminar todos |
| Imports | ❌ Inconsistentes | Estandarizar |
| Documentación | ✅ Existe | Actualizar |

---

## 🚀 PRÓXIMOS PASOS

1. Detener el servidor
2. Limpiar duplicados
3. Reorganizar estructura
4. Actualizar imports
5. Reescribir `app/page.tsx` (versión FINAL)
6. Reiniciar servidor
7. Verificar que TODO funciona




