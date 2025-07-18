'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ActionCard from '@/components/ui/ActionCard';
import FeatureCard from '@/components/ui/FeatureCard';
import {
  BarChart3,
  Users,
  Settings,
  ShieldCheck,
  UserPlus,
  FileText,
  Bell,
  HelpCircle,
} from 'lucide-react';
import Image from 'next/image';
import { User } from '@/types/user';

interface AdminHomeProps {
  user: User;
}

export default function AdminHome({ user: _user }: AdminHomeProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Bienvenido, <span className="text-primary">Administrador</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Desde aquí puedes acceder rápidamente a todas las herramientas y funciones
                administrativas de la plataforma.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard/admin/users">
                  <Button size="lg" className="gap-2">
                    <Users className="h-5 w-5" />
                    Gestionar usuarios
                  </Button>
                </Link>
                <Link href="/dashboard/admin">
                  <Button variant="outline" size="lg">
                    Panel administrativo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full filter blur-xl"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/20 rounded-full filter blur-xl"></div>
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                  alt="Administración de plataforma"
                  className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
                  width={500}
                  height={375}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Acciones rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard
              title="Gestionar usuarios"
              description="Administra todos los usuarios de la plataforma"
              icon={<Users className="h-8 w-8 text-primary" />}
              href="/dashboard/admin/users"
            />
            <ActionCard
              title="Crear usuario"
              description="Añade un nuevo usuario al sistema"
              icon={<UserPlus className="h-8 w-8 text-primary" />}
              href="/dashboard/admin/users/new"
            />
            <ActionCard
              title="Panel administrativo"
              description="Accede a estadísticas y herramientas avanzadas"
              icon={<BarChart3 className="h-8 w-8 text-primary" />}
              href="/dashboard/admin"
            />
            <ActionCard
              title="Configuración"
              description="Ajusta la configuración del sistema"
              icon={<Settings className="h-8 w-8 text-primary" />}
              href="/dashboard/admin"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Características principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="h-10 w-10 text-primary" />}
              title="Gestión de seguridad"
              description="Controla los permisos y accesos de todos los usuarios de la plataforma para mantener la seguridad del sistema."
            />
            <FeatureCard
              icon={<Bell className="h-10 w-10 text-primary" />}
              title="Notificaciones"
              description="Mantente informado sobre actividades importantes y eventos del sistema que requieran tu atención."
            />
            <FeatureCard
              icon={<FileText className="h-10 w-10 text-primary" />}
              title="Reportes detallados"
              description="Accede a informes completos sobre el uso de la plataforma, usuarios y actividad del sistema."
            />
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card border rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <HelpCircle className="h-12 w-12 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">¿Necesitas ayuda?</h3>
                <p className="text-muted-foreground mb-4">
                  Si tienes dudas sobre cómo utilizar las herramientas administrativas o necesitas
                  asistencia, consulta nuestra documentación o contacta con el equipo de soporte.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline">Ver documentación</Button>
                  <Button>Contactar soporte</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Utilizamos el componente ActionCard optimizado con React.memo
// El componente está definido en src/components/ui/ActionCard.tsx

// Utilizamos el componente FeatureCard optimizado con React.memo
// El componente está definido en src/components/ui/FeatureCard.tsx
