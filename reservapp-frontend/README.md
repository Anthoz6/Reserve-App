# ReservApp Frontend

Frontend de la aplicación de reservas de servicios desarrollado con Next.js, TypeScript y Tailwind CSS.

## 🚀 Tecnologías

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios con interceptores JWT
- **Gestión de Estado**: React Context (próximamente)
- **Formularios**: React Hook Form + Zod
- **Notificaciones**: Sonner

## 📁 Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base de shadcn/ui
│   ├── auth/           # Componentes de autenticación
│   ├── services/       # Componentes de servicios
│   └── reservations/   # Componentes de reservas
├── lib/
│   ├── api/            # Servicios API y cliente HTTP
│   ├── auth/           # Utilidades de autenticación
│   └── utils/          # Utilidades generales
├── types/              # Interfaces TypeScript
├── context/            # Contextos de React
└── hooks/              # Custom hooks
```

## 🛠️ Configuración

### Instalación

```bash
pnpm install
```

### Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:4200](http://localhost:4200)

### Build

```bash
pnpm build
pnpm start
```

## 🔧 Estado del Proyecto

### ✅ Completado
- **Fase 1**: Configuración base (Next.js, TypeScript, Tailwind, shadcn/ui)
- **Fase 2**: Tipos y API base (interfaces, servicios HTTP, endpoints)

### 🚧 En Desarrollo
- **Fase 3**: Sistema de autenticación
- **Fase 4**: Dashboard base y navegación

### 📋 Próximas Fases
- Fase 5-10: Funcionalidades específicas por rol

## 🔌 API Backend

El frontend se conecta a un backend Java con Spring Boot en `http://localhost:8080`.

## 👥 Roles de Usuario

- **ADMIN**: Gestión completa de usuarios y sistema
- **PROVIDER**: Gestión de servicios y reservas recibidas
- **CUSTOMER**: Reserva de servicios
