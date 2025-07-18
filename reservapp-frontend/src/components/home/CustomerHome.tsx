'use client';

import React, { useState, createContext } from 'react';
import Link from 'next/link';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ServiceCard from '@/components/ui/ServiceCard';
import {
  Search,
  Calendar,
  Clock,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Zap,
  Clock3,
} from 'lucide-react';
import Image from 'next/image';

// Datos de ejemplo para mostrar
const FEATURED_SERVICES = [
  {
    id: 1,
    title: 'Corte de cabello profesional',
    category: 'Belleza',
    price: 25.99,
    rating: 4.8,
    reviews: 124,
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    provider: 'Salón Elegance',
  },
  {
    id: 2,
    title: 'Masaje terapéutico',
    category: 'Bienestar',
    price: 45.0,
    rating: 4.9,
    reviews: 89,
    image:
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    provider: 'Spa Relax',
  },
  {
    id: 3,
    title: 'Limpieza dental completa',
    category: 'Salud',
    price: 75.5,
    rating: 4.7,
    reviews: 56,
    image:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    provider: 'Clínica Dental Sonrisa',
  },
  {
    id: 4,
    title: 'Manicura y pedicura',
    category: 'Belleza',
    price: 35.0,
    rating: 4.6,
    reviews: 78,
    image:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    provider: 'Nail Studio',
  },
];

const TRENDING_SERVICES = [
  {
    id: 5,
    title: 'Sesión de yoga personalizada',
    category: 'Fitness',
    price: 30.0,
    rating: 4.7,
    reviews: 45,
    image:
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    provider: 'Zen Yoga Center',
  },
  {
    id: 6,
    title: 'Consulta nutricional',
    category: 'Salud',
    price: 55.0,
    rating: 4.8,
    reviews: 32,
    image:
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    provider: 'Nutrición Vital',
  },
  {
    id: 7,
    title: 'Entrenamiento personal',
    category: 'Fitness',
    price: 40.0,
    rating: 4.9,
    reviews: 67,
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    provider: 'FitLife Gym',
  },
  {
    id: 8,
    title: 'Terapia de fisioterapia',
    category: 'Salud',
    price: 65.0,
    rating: 4.8,
    reviews: 41,
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    provider: 'Centro de Rehabilitación',
  },
];

const RECENT_BOOKINGS = [
  {
    id: 101,
    service: 'Corte de cabello profesional',
    provider: 'Salón Elegance',
    date: '2025-07-25',
    time: '14:30',
    status: 'Confirmada',
  },
  {
    id: 102,
    service: 'Masaje terapéutico',
    provider: 'Spa Relax',
    date: '2025-07-30',
    time: '10:00',
    status: 'Pendiente',
  },
];

const CATEGORIES = [
  { id: 1, name: 'Belleza', icon: '💇‍♀️' },
  { id: 2, name: 'Salud', icon: '🏥' },
  { id: 3, name: 'Fitness', icon: '🏋️‍♂️' },
  { id: 4, name: 'Bienestar', icon: '🧘‍♀️' },
  { id: 5, name: 'Educación', icon: '📚' },
  { id: 6, name: 'Hogar', icon: '🏠' },
];

// Definir el contexto para compartir el estado de invitado y la función de redirección
interface CustomerContextType {
  isGuest: boolean;
  redirectToLogin: (e: React.MouseEvent) => void;
}

const CustomerContext = createContext<CustomerContextType>({
  isGuest: false,
  redirectToLogin: () => {},
});

interface CustomerHomeProps {
  user: User | null;
  isGuest?: boolean;
}

export default function CustomerHome({ user, isGuest = false }: CustomerHomeProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Función para redirigir a login si es un invitado
  const redirectToLogin = (e: React.MouseEvent) => {
    if (isGuest) {
      e.preventDefault();
      window.location.href = '/login';
    }
  };

  // Determinar el texto y comportamiento según si es invitado o usuario autenticado
  const heroSubtitle = isGuest
    ? 'Miles de servicios profesionales a tu alcance. Inicia sesión para reservar en segundos y disfrutar de experiencias excepcionales.'
    : 'Miles de servicios profesionales a tu alcance. Reserva en segundos y disfruta de experiencias excepcionales.';

  // Valor del contexto
  const contextValue = {
    isGuest,
    redirectToLogin,
  };

  return (
    <CustomerContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="md:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Descubre y reserva los <span className="text-primary">mejores servicios</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-6">{heroSubtitle}</p>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar servicios, categorías o proveedores..."
                    className="pl-10 py-6 text-lg rounded-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={isGuest ? redirectToLogin : undefined}
                  />
                  <Button
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
                    onClick={isGuest ? redirectToLogin : undefined}
                  >
                    Buscar
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full filter blur-xl"></div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/20 rounded-full filter blur-xl"></div>
                  <Image
                    src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                    alt="Reserva de servicios"
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

        {/* Categories Section */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Explora por categorías</h2>
              <Button
                variant="ghost"
                className="flex items-center gap-1"
                onClick={isGuest ? redirectToLogin : undefined}
              >
                Ver todas <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {CATEGORIES.map((category) =>
                isGuest ? (
                  <div
                    key={category.id}
                    className="bg-card hover:bg-accent/10 border rounded-xl p-4 text-center transition-colors cursor-pointer"
                    onClick={redirectToLogin}
                  >
                    <div className="text-4xl mb-2">{category.icon}</div>
                    <h3 className="font-medium">{category.name}</h3>
                  </div>
                ) : (
                  <Link
                    href={`/dashboard/customer/services?category=${category.name}`}
                    key={category.id}
                  >
                    <div className="bg-card hover:bg-accent/10 border rounded-xl p-4 text-center transition-colors cursor-pointer">
                      <div className="text-4xl mb-2">{category.icon}</div>
                      <h3 className="font-medium">{category.name}</h3>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="py-12 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Servicios destacados</h2>
              </div>
              {isGuest ? (
                <Button
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={redirectToLogin}
                >
                  Ver todos <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Link href="/dashboard/customer/services">
                  <Button variant="outline" className="flex items-center gap-1">
                    Ver todos <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURED_SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* Recent Bookings (if user is logged in and not a guest) */}
        {user && !isGuest && (
          <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Tus reservas recientes</h2>
                </div>
                <Link href="/dashboard/customer/reservations">
                  <Button variant="ghost" className="flex items-center gap-1">
                    Ver todas <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              {RECENT_BOOKINGS.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {RECENT_BOOKINGS.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-card border rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{booking.service}</h3>
                        <p className="text-sm text-muted-foreground">{booking.provider}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                          <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                          <span className="text-sm">{booking.time}</span>
                        </div>
                      </div>
                      <Badge variant={booking.status === 'Confirmada' ? 'default' : 'outline'}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-card border rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No tienes reservas recientes</h3>
                  <p className="text-muted-foreground mb-4">
                    Explora nuestros servicios y haz tu primera reserva
                  </p>
                  <Link href="/dashboard/customer/services">
                    <Button>Explorar servicios</Button>
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Trending Services */}
        <section className="py-12 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Tendencias del momento</h2>
              </div>
              {isGuest ? (
                <Button
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={redirectToLogin}
                >
                  Ver todos <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Link href="/dashboard/customer/services">
                  <Button variant="outline" className="flex items-center gap-1">
                    Ver todos <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TRENDING_SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* Special Offers */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full transform translate-x-1/3 -translate-y-1/3 filter blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full transform -translate-x-1/3 translate-y-1/3 filter blur-3xl"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-2/3">
                  <Badge className="mb-4">Oferta especial</Badge>
                  <h2 className="text-3xl font-bold mb-4">
                    ¡20% de descuento en tu primera reserva!
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Usa el código <span className="font-bold">PRIMERA20</span> al hacer tu primera
                    reserva y obtén un 20% de descuento.
                  </p>
                  {isGuest ? (
                    <Button size="lg" className="gap-2" onClick={redirectToLogin}>
                      <Zap className="h-5 w-5" />
                      Iniciar sesión para reservar
                    </Button>
                  ) : (
                    <Link href="/dashboard/customer/services">
                      <Button size="lg" className="gap-2">
                        <Zap className="h-5 w-5" />
                        Reservar ahora
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <div className="bg-background rounded-full p-8 shadow-xl">
                    <div className="text-6xl font-bold text-primary">20%</div>
                    <div className="text-xl font-medium">DESCUENTO</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action for Guests */}
        {isGuest && (
          <section className="py-16 px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Inicia sesión ahora para descubrir y reservar los mejores servicios profesionales.
              </p>
              <Link href="/login">
                <Button size="lg" className="px-8">
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          </section>
        )}
      </div>
    </CustomerContext.Provider>
  );
}
