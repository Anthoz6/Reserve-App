'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/ui/StatCard';
import ActionCard from '@/components/ui/ActionCard';
import {
  ChevronRight,
  BarChart3,
  Calendar,
  Clock,
  Users,
  PlusCircle,
  TrendingUp,
  Settings,
  AlertCircle,
  CheckCircle2,
  XCircle,
  DollarSign,
} from 'lucide-react';
import Image from 'next/image';
import { User } from '@/types/user';

interface ProviderHomeProps {
  user: User;
}

// Datos de ejemplo para mostrar
const PROVIDER_STATS = {
  totalServices: 8,
  activeReservations: 12,
  completedReservations: 45,
  totalEarnings: 1250.75,
  averageRating: 4.8,
};

const RECENT_SERVICES = [
  {
    id: 1,
    title: 'Corte de cabello profesional',
    price: 25.99,
    bookings: 24,
    rating: 4.8,
    isActive: true,
  },
  {
    id: 2,
    title: 'Tratamiento facial completo',
    price: 45.0,
    bookings: 18,
    rating: 4.9,
    isActive: true,
  },
  {
    id: 3,
    title: 'Manicura y pedicura',
    price: 35.0,
    bookings: 15,
    rating: 4.7,
    isActive: true,
  },
];

const UPCOMING_RESERVATIONS = [
  {
    id: 101,
    service: 'Corte de cabello profesional',
    customer: 'Carlos Rodríguez',
    date: '2025-07-25',
    time: '14:30',
    status: 'confirmed',
  },
  {
    id: 102,
    service: 'Tratamiento facial completo',
    customer: 'Ana López',
    date: '2025-07-26',
    time: '10:00',
    status: 'pending',
  },
  {
    id: 103,
    service: 'Manicura y pedicura',
    customer: 'María González',
    date: '2025-07-26',
    time: '16:15',
    status: 'confirmed',
  },
];

export default function ProviderHome({ user: _user }: ProviderHomeProps) {
  const [backendWarning] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Gestiona tus <span className="text-primary">servicios y reservas</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Bienvenido a tu panel de proveedor. Administra tus servicios, gestiona reservas y
                haz crecer tu negocio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard/provider/services/new">
                  <Button size="lg" className="gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Crear nuevo servicio
                  </Button>
                </Link>
                <Link href="/dashboard/provider/services">
                  <Button variant="outline" size="lg">
                    Gestionar servicios
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full filter blur-xl"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/20 rounded-full filter blur-xl"></div>
                <Image
                  src="https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                  alt="Gestión de servicios"
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

      {/* Backend Warning */}
      {backendWarning && (
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <p className="text-amber-800">
              Algunas funcionalidades de reservas están pendientes de implementación en el backend.
              Las estadísticas y datos mostrados son simulados.
            </p>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Resumen de actividad</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard
              icon={<Settings className="h-6 w-6 text-primary" />}
              title="Servicios"
              value={PROVIDER_STATS.totalServices}
            />
            <StatCard
              icon={<Calendar className="h-6 w-6 text-primary" />}
              title="Reservas activas"
              value={PROVIDER_STATS.activeReservations}
              note="Pendiente backend"
            />
            <StatCard
              icon={<CheckCircle2 className="h-6 w-6 text-primary" />}
              title="Completadas"
              value={PROVIDER_STATS.completedReservations}
              note="Pendiente backend"
            />
            <StatCard
              icon={<DollarSign className="h-6 w-6 text-primary" />}
              title="Ingresos"
              value={`$${PROVIDER_STATS.totalEarnings.toFixed(2)}`}
              note="Pendiente backend"
            />
            <StatCard
              icon={<TrendingUp className="h-6 w-6 text-primary" />}
              title="Valoración"
              value={PROVIDER_STATS.averageRating}
              note="Pendiente backend"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Tus servicios</h2>
            <Link href="/dashboard/provider/services">
              <Button variant="outline" className="flex items-center gap-1">
                Ver todos <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECENT_SERVICES.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={service.isActive ? 'default' : 'outline'}>
                      {service.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <span className="font-bold text-lg">${service.price.toFixed(2)}</span>
                  </div>
                  <h3 className="font-medium text-lg mb-4">{service.title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{service.bookings} reservas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Rating: {service.rating}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <Link href={`/dashboard/provider/services/${service.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Ver detalles
                      </Button>
                    </Link>
                    <Link
                      href={`/dashboard/provider/services/edit?id=${service.id}`}
                      className="flex-1"
                    >
                      <Button className="w-full">Editar</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Reservations */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Próximas reservas</h2>
            <Link href="/dashboard/provider/reservations">
              <Button variant="outline" className="flex items-center gap-1">
                Ver todas <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {backendWarning ? (
            <div className="bg-card border rounded-lg p-8 text-center">
              <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-amber-100">
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">Funcionalidad en desarrollo</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                La gestión de reservas para proveedores está pendiente de implementación en el
                backend. Esta vista mostrará todas las reservas recibidas para tus servicios.
              </p>
              <Link href="/dashboard/provider/reservations">
                <Button>Ver más detalles</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {UPCOMING_RESERVATIONS.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-card border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-medium">{reservation.service}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{reservation.customer}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(reservation.date).toLocaleDateString()}
                      </span>
                      <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                      <span className="text-sm">{reservation.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={reservation.status === 'confirmed' ? 'default' : 'outline'}>
                      {reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {reservation.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline" className="gap-1">
                            <XCircle className="h-4 w-4" />
                            Rechazar
                          </Button>
                          <Button size="sm" className="gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            Confirmar
                          </Button>
                        </>
                      )}
                      {reservation.status === 'confirmed' && (
                        <Button size="sm" variant="outline">
                          Ver detalles
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Performance Insights */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Análisis de rendimiento</h2>
          </div>

          <div className="bg-card border rounded-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-primary/10">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Estadísticas avanzadas</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Próximamente podrás acceder a estadísticas detalladas sobre el rendimiento de tus
              servicios, tendencias de reservas y análisis de ingresos.
            </p>
            <Button disabled>Función próximamente</Button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Acciones rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard
              title="Crear servicio"
              description="Añade un nuevo servicio a tu catálogo"
              icon={<PlusCircle className="h-8 w-8 text-primary" />}
              href="/dashboard/provider/services/new"
            />
            <ActionCard
              title="Gestionar servicios"
              description="Edita o actualiza tus servicios existentes"
              icon={<Settings className="h-8 w-8 text-primary" />}
              href="/dashboard/provider/services"
            />
            <ActionCard
              title="Ver reservas"
              description="Gestiona las reservas de tus clientes"
              icon={<Calendar className="h-8 w-8 text-primary" />}
              href="/dashboard/provider/reservations"
            />
            <ActionCard
              title="Panel principal"
              description="Accede a tu dashboard completo"
              icon={<BarChart3 className="h-8 w-8 text-primary" />}
              href="/dashboard/provider"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// Utilizamos los componentes StatCard y ActionCard optimizados con React.memo
// Los componentes están definidos en src/components/ui/StatCard.tsx y src/components/ui/ActionCard.tsx
