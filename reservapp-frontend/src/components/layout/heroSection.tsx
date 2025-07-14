import React from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, ShieldCheck, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";

// --- Componentes de UI (simulando shadcn/ui) ---
// En un proyecto real, estos se importarían desde '@/components/ui/*'

const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variantClasses = "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80";
  return <div className={`${baseClasses} ${variantClasses} ${className}`} {...props} />;
};
Badge.displayName = 'Badge';

// --- Interfaz de Props del Componente ---

interface HeroSectionProps {
  isAuthenticated: boolean;
  user?: {
    name: string;
    role: { role: string };
  } | null;
}

// --- Mapeo de Roles a Rutas ---

const dashboardPaths: { [key: string]: string } = {
  ADMIN: '/dashboard/admin',
  PROVIDER: '/dashboard/provider',
  CUSTOMER: '/dashboard/customer',
  default: '/dashboard',
};

// --- Componente Principal HeroSection ---

export default function HeroSection({ isAuthenticated, user }: HeroSectionProps) {
  const userRole = user?.role?.role?.toUpperCase() || 'default';
  const dashboardPath = dashboardPaths[userRole] || dashboardPaths.default;

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-background text-foreground p-4 sm:p-6 md:p-8">
      {/* Fondo decorativo con blobs gradientes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-secondary/30 dark:bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-[spin_25s_linear_infinite_reverse]"></div>
        <div className="absolute top-[30%] right-[10%] w-72 h-72 bg-accent/20 dark:bg-accent/10 rounded-full filter blur-2xl opacity-40 animate-[spin_15s_linear_infinite]"></div>
      </div>

      <div className="relative z-10 text-center animate-in fade-in slide-in-from-top-8 duration-1000 ease-out">
        {/* Contenido Principal */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent pb-2">
            Gestiona tus Reservas, Simplifica tu Vida.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground">
            ReservApp es la plataforma todo en uno para proveedores y clientes. Agenda, gestiona y organiza tus citas y servicios sin esfuerzo.
          </p>
        </div>

        {/* Llamada a la Acción (Condicional) */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium">¡Hola, {user.name}!</span>
                <Badge className="capitalize">{user.role.role}</Badge>
              </div>
              <Link href={dashboardPath}>
                <Button asChild size="lg" className="group">
                  <span>
                    Ir a mi Panel
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/register">
                <Button asChild size="lg" className="group w-full sm:w-auto">
                  <span>
                    Empezar Ahora
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <Link href="/login">
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <span>Iniciar Sesión</span>
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Sección de Beneficios/Características */}
        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left">
            <FeatureCard
              icon={<CalendarCheck className="h-8 w-8 text-primary" />}
              title="Reservas Fáciles"
              description="Agenda citas en segundos con una interfaz intuitiva y amigable."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary" />}
              title="Gestión de Clientes"
              description="Mantén un registro de tus clientes y su historial de reservas."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-primary" />}
              title="Seguro y Confiable"
              description="Tus datos están protegidos con los más altos estándares de seguridad."
            />
          </div>
        </div>
      </div>
      
      {/* Onda decorativa en la parte inferior */}
      <div className="absolute bottom-0 left-0 w-full h-24 z-0">
        <svg className="w-full h-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1440 120H0V0C480 80 960 80 1440 0V120Z" className="fill-background" />
        </svg>
      </div>
    </section>
  );
}

// --- Componente Auxiliar para Tarjetas de Características ---

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 bg-card/50 dark:bg-card/70 backdrop-blur-sm rounded-xl border border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
