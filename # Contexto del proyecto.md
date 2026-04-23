# Contexto del proyecto

Estás ayudando a construir el frontend de una aplicación web en React llamada
**Orbitra**, un calendario astronómico por años con sistema de cuentas,
suscripciones a eventos y recordatorios por correo electrónico.

Tu rol es actuar en React con enfoque en
UX/UI y arquitectura limpia.

---

## Objetivo de la aplicación

Permitir a los usuarios:

- Explorar eventos astronómicos (eclipses, lluvias de meteoros, fases lunares, etc.)
- Crear una cuenta e iniciar sesión
- Suscribirse solo a los eventos astronómicos que les interesan
- Recibir recordatorios por correo electrónico antes de cada evento
  (el envío real del correo lo gestiona el backend)

---

## Stack y lineamientos técnicos

- React (hooks, functional components)
- React Router para navegación
- Context API o un store simple para estado de autenticación
- Código modular y reutilizable
- Componentes desacoplados del backend (uso de servicios/API mock)
- Diseño responsive (mobile-first)

---

## Estructura sugerida del proyecto

- src/
  - components/
    - Calendar/
    - EventCard/
    - EventFilter/
    - Navbar/
    - ProtectedRoute/
  - pages/
    - LandingPage.jsx
    - Login.jsx
    - Register.jsx
    - CalendarPage.jsx
    - Profile.jsx
  - context/
    - AuthContext.jsx
  - services/
    - api.js (simulación de llamadas a backend)
  - styles/
  - App.jsx
  - main.jsx

---

## Funcionalidades requeridas

### 1. Landing Page
- Presentación clara de la app
- CTA: “Explorar calendario”, “Crear cuenta”, “Iniciar sesión”
- Diseño con temática astronómica (espacio, estrellas)

---

### 2. Autenticación
- Formularios de registro e inicio de sesión
- Manejo de estados: loading, error, success
- Simular autenticación con contexto global
- Protección de rutas privadas (calendario y perfil)

---

### 3. Calendario astronómico
- Vista por año y por mes
- Posibilidad de cambiar entre vista calendario y lista
- Cada evento muestra:
  - Nombre
  - Fecha y hora
  - Breve descripción
  - Tipo de evento

---


### 4. Recordatorios
- Toggle para activar/desactivar recordatorios por email
- Selector de anticipación (ej. 1 día antes, 1 hora antes)
- Solo interfaz (el backend se encargará del envío real)

---

### 5. Perfil de usuario
- Ver eventos suscritos
- Editar preferencias

---

## Experiencia de usuario (UX/UI)

- Interfaz clara, moderna e intuitiva
- Uso consistente de colores para tipos de eventos
- Feedback visual en acciones importantes
- Buen manejo de estados vacíos

---

## Importante

- No implementar backend real
- Asumir endpoints REST (GET /events, POST /login, POST /subscribe, etc.)
- Priorizar legibilidad, buenas prácticas y escalabilidad

Genera componentes, hooks y lógica siguiendo este contexto.