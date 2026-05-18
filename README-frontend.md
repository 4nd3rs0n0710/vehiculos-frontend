# 🚗 Vehicles Manager — Frontend

Aplicación web construida con **Next.js 14 (App Router)** para gestión de vehículos de concesionario. Consume la API REST del backend, implementa autenticación JWT, control de acceso por roles y animaciones fluidas.

---

## 🛠 Stack

| Tecnología | Versión |
|---|---|
| Next.js | 16.x (App Router) |
| TypeScript | — |
| Tailwind CSS | — |
| Framer Motion | — |
| Axios | — |
| js-cookie | — |

---

## 📁 Estructura del proyecto

```
vehiculos-frontend/
├── app/
│   ├── page.tsx              # Redirect a /login
│   ├── login/page.tsx        # Pantalla de login
│   ├── home/page.tsx         # Pantalla de bienvenida con animaciones
│   ├── signup/page.tsx       # Registro de usuarios
│   ├── recovery/page.tsx     # Recuperación de contraseña
│   ├── reset-password/page.tsx # Restablecimiento de contraseña
│   ├── dashboard/page.tsx    # CRUD de vehículos
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── PageTransition.tsx    # Transición entre páginas
│   └── vehiculos/
│       └── VehiculoTable.tsx # Tabla con modal de confirmación
├── lib/
│   ├── axios.ts              # Interceptores JWT
│   ├── auth.ts               # Manejo de cookies (tokens, rol, username)
│   ├── useLoginForm.ts       # Hook SRP para login
│   └── useSignupForm.ts      # Hook SRP para registro
├── types/
│   └── index.ts              # Interfaces TypeScript
└── proxy.ts                  # Middleware de rutas protegidas
```

---

## 🔐 Seguridad y Autenticación

- **JWT** almacenado en cookies seguras (access 60min, refresh 7 días)
- **Interceptores Axios** adjuntan automáticamente el `Bearer token` en cada petición
- **Manejo de 401**: limpia sesión y redirige al login con mensaje de sesión expirada
- **Rutas protegidas** con `proxy.ts` — redirige al login si no hay token
- **Renderizado condicional por rol**: viewers no ven botones de crear, editar ni eliminar

---

## 🎨 Diseño

Paleta de colores del proyecto:

| Variable | Color |
|---|---|
| Blue 1 | `#00249C` |
| Blue 2 | `#40CEE4` |
| Grey 1 | `#C5C5C5` |
| Red 1 | `#C6007E` |
| Red 2 | `#E280BE` |

Fuente: [Montserrat](https://fonts.google.com/specimen/Montserrat)

---

## 🚀 Instalación y ejecución local

### Requisitos previos

- Node.js 18+
- Backend corriendo en `http://localhost:8000`

### Pasos

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd vehiculos-frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_FRONTEND_REPO=https://github.com/tu-usuario/vehiculos-frontend
NEXT_PUBLIC_BACKEND_REPO=https://github.com/tu-usuario/vehiculos-backend
```

4. Correr el servidor de desarrollo:
```bash
npm run dev
```

5. Abrir en el browser: `http://localhost:3000`

---

## 📱 Páginas

| Ruta | Descripción | Protegida |
|---|---|---|
| `/login` | Inicio de sesión | No |
| `/signup` | Registro de usuario | No |
| `/recovery` | Recuperación de contraseña | No |
| `/reset-password` | Restablecer contraseña (requiere token en URL) | No |
| `/home` | Pantalla de bienvenida con animaciones | Sí |
| `/dashboard` | CRUD de vehículos | Sí |

---

## ✨ Funcionalidades

- Login con email o username
- Registro de nuevos usuarios
- Recuperación y restablecimiento de contraseña por email
- Dashboard con tabla de vehículos
- Crear, editar y eliminar vehículos (solo admins)
- Animación de eliminación en la tabla
- Dropdown de usuario con nombre, rol y cierre de sesión
- Toasts de éxito y error
- Modal de confirmación de eliminación
- Animaciones de home (óvalo animado, teléfono flotante)

---

## 🏗 Arquitectura

El proyecto sigue principios de **Clean Architecture** y **SOLID**:

- **SRP**: lógica de negocio separada en custom hooks (`useLoginForm`, `useSignupForm`)
- **DIP**: componentes dependen de abstracciones (`lib/axios`, `lib/auth`)
- **Separación de responsabilidades**: UI, lógica y servicios en capas distintas

---

## 🌐 Despliegue

El frontend está desplegado en **Vercel**.

🔗 URL de producción: `<url-vercel>`