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
reservapp-frontend/
├── src/
│   ├── app/                    # App Router (Next.js)
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── services/
│   │   ├── reservations/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # Componentes base (Button, Input, etc.)
│   │   ├── auth/               # Componentes de autenticación
│   │   ├── services/           # Componentes de servicios
│   │   └── reservations/       # Componentes de reservas
│   ├── lib/
│   │   ├── api/                # Configuración de API y endpoints
│   │   ├── auth/               # Manejo de autenticación
│   │   ├── utils/              # Utilidades
│   │   └── validations/        # Esquemas de validación
│   ├── types/                  # Tipos TypeScript
│   ├── hooks/                  # Custom hooks
│   └── context/                # Context providers
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
