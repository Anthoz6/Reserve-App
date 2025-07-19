# ReservApp Frontend

Aplicación web moderna para la gestión de reservas de servicios, desarrollada con Next.js 15, TypeScript y Tailwind CSS. Sistema completo con autenticación JWT y roles diferenciados para administradores, proveedores de servicios y clientes.

## 🚀 Tecnologías

- **Framework**: Next.js 15 con App Router y Turbopack
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS v4.1
- **UI Components**: Radix UI + shadcn/ui
- **HTTP Client**: Axios con interceptores JWT
- **Gestión de Estado**: React Context API
- **Formularios**: React Hook Form + Zod
- **Notificaciones**: Sonner
- **Autenticación**: JWT almacenado en cookies
- **Temas**: next-themes (soporte para modo oscuro en estilos)
- **IDE**: Kiro IDE (Beta) - Amazon

## 📁 Estructura del Proyecto

```
reservapp-frontend/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── dashboard/          # Dashboards por rol
│   │   ├── login/              # Página de autenticación
│   │   ├── unauthorized/       # Página de acceso denegado
│   │   ├── globals.css         # Estilos globales y variables CSS
│   │   ├── layout.tsx          # Layout principal con providers
│   │   ├── page.tsx            # Página de inicio dinámica por rol
│   │   └── favicon.ico         # Icono de la aplicación
│   ├── components/
│   │   ├── ui/                 # Componentes base (shadcn/ui)
│   │   ├── auth/               # Componentes de autenticación y guards
│   │   ├── admin/              # Componentes específicos de administrador
│   │   ├── home/               # Páginas de inicio diferenciadas por rol
│   │   └── layout/             # Componentes de navegación y header
│   ├── lib/
│   │   ├── api/                # Cliente HTTP, endpoints y servicios
│   │   │   └── services/       # Servicios específicos por dominio
│   │   ├── auth/               # Utilidades y configuración de autenticación
│   │   ├── middleware/         # Middleware de Next.js para protección de rutas
│   │   └── utils.ts            # Utilidades generales (cn, etc.)
│   ├── types/                  # Definiciones TypeScript por dominio
│   ├── hooks/                  # Custom hooks (useAuth, usePermissions)
│   └── context/                # Context providers (AuthContext)
├── public/                     # Archivos estáticos (SVGs, imágenes)
├── middleware.ts               # Punto de entrada del middleware
├── components.json             # Configuración de shadcn/ui
├── postcss.config.mjs          # Configuración de PostCSS para Tailwind
├── next.config.ts              # Configuración de Next.js
├── tsconfig.json               # Configuración de TypeScript
└── package.json                # Dependencias y scripts
```

## 🛠️ Configuración y Desarrollo

### Requisitos Previos

- Node.js 18+
- pnpm (recomendado)
- Backend Java Spring Boot ejecutándose en puerto 8080

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd reservapp-frontend

# Instalar dependencias
pnpm install
```

### Variables de Entorno

Crear archivo `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Comandos Disponibles

```bash
# Desarrollo con Turbopack
pnpm dev

# Build de producción
pnpm build

# Iniciar en producción
pnpm start

# Linting y formateo
pnpm lint
pnpm lint:fix
pnpm format
pnpm check-format
pnpm check-types

# Validación completa
pnpm validate
```

La aplicación estará disponible en [http://localhost:4200](http://localhost:4200)

## 🔐 Sistema de Autenticación

- **JWT**: Tokens almacenados en cookies del navegador
- **Middleware**: Protección automática de rutas por roles
- **Context API**: Estado global de autenticación
- **Interceptores**: Manejo automático de tokens y errores
- **Redirección**: Automática según rol del usuario

## 👥 Roles y Permisos

### ADMIN

- Gestión completa de usuarios
- Visualización de estadísticas del sistema
- Acceso a todas las funcionalidades

### PROVIDER

- Gestión de servicios propios
- Visualización de reservas recibidas
- Dashboard con métricas de negocio

### CUSTOMER

- Navegación del catálogo de servicios
- Creación y gestión de reservas
- Perfil de usuario

## 🎨 Características de UI/UX

- **Responsive Design**: Parcialmente implementado (no se rompe en móviles/tablets pero algunos componentes necesitan optimización)
- **Modo Oscuro**: Variables CSS configuradas pero implementación pendiente
- **Componentes Accesibles**: Basados en Radix UI
- **Loading States**: Indicadores de carga con Suspense
- **Error Handling**: Manejo elegante de errores
- **Notificaciones**: Sistema toast con Sonner
- **Lazy Loading**: Carga diferida de componentes

## 🔌 Integración con Backend

- **Base URL**: `http://localhost:8080`
- **Autenticación**: Bearer Token JWT
- **Endpoints**: RESTful API con Spring Boot

## 📊 Estado Actual del Desarrollo

### ✅ Implementado

- ✅ Configuración base del proyecto
- ✅ Sistema de tipos TypeScript completo
- ✅ Cliente HTTP con interceptores
- ✅ Autenticación JWT funcional
- ✅ Context API para estado global
- ✅ Middleware de protección de rutas
- ✅ Componentes UI base (shadcn/ui)
- ✅ Layout responsive con navegación
- ✅ Páginas de inicio diferenciadas por rol
- ✅ Componentes de administración básicos
- ✅ Sistema de notificaciones
- ✅ Manejo de estados de carga y error

### 🚧 En Desarrollo

- 🔄 Formularios de gestión de usuarios
- 🔄 CRUD completo de servicios
- 🔄 Sistema de reservas
- 🔄 Dashboard con métricas avanzadas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
