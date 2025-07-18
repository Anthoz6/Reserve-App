'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RoleGuard } from '@/components/auth/role-guard';
import { RoleEnum } from '@/types/role';
import { servicesService } from '@/lib/api/services/services_service';
import { reservationsService } from '@/lib/api/services/reservations_service';
import { Service } from '@/types/service';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import { PlusIcon, BarChart3Icon, CalendarIcon, AlertTriangleIcon } from 'lucide-react';

export default function ProviderDashboardPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.PROVIDER]}>
      <ProviderDashboardContent />
    </RoleGuard>
  );
}

function ProviderDashboardContent() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [reservationStats, setReservationStats] = useState<{
    pendingCount: number;
    totalIncome: number;
  }>({ pendingCount: 0, totalIncome: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendWarning, setBackendWarning] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Cargar servicios
        const servicesData = await servicesService.getMyServices();
        setServices(servicesData);

        // Intentar cargar estadísticas de reservas
        try {
          const stats = await reservationsService.getProviderReservationStats();
          setReservationStats(stats);
        } catch (statsErr) {
          console.warn('No se pudieron cargar las estadísticas de reservas:', statsErr);
          setBackendWarning(
            'Algunas funcionalidades están pendientes de implementación en el backend',
          );
        }
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard de Proveedor</h1>
          <p className="text-muted-foreground">Gestiona tus servicios y reservas</p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/provider/services/new')}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Crear Servicio
        </Button>
      </div>

      {/* Backend Warning */}
      {backendWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertTriangleIcon className="w-5 h-5 text-amber-500" />
          <p className="text-amber-800 text-sm">{backendWarning}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-muted rounded-md">
              <BarChart3Icon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-card-foreground">{services.length}</div>
            <div className="text-sm text-muted-foreground">Servicios Activos</div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-muted rounded-md">
              <CalendarIcon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-card-foreground">
              {reservationStats.pendingCount || '-'}
              {backendWarning && <span className="text-xs text-amber-500 ml-2">(Pendiente)</span>}
            </div>
            <div className="text-sm text-muted-foreground">Reservas Pendientes</div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-muted rounded-md">
              <BarChart3Icon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-card-foreground">
              {reservationStats.totalIncome ? `$${reservationStats.totalIncome.toFixed(2)}` : '-'}
              {backendWarning && <span className="text-xs text-amber-500 ml-2">(Pendiente)</span>}
            </div>
            <div className="text-sm text-muted-foreground">Ingresos Totales</div>
          </div>
        </div>
      </div>

      {/* Recent Services */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Mis Servicios</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/provider/services')}
            >
              Ver todos
            </Button>
          </div>
        </div>

        <div className="p-6">
          {error && <div className="text-center p-4 text-destructive">{error}</div>}

          {!error && services.length === 0 ? (
            <div className="text-center p-8">
              <h3 className="text-lg font-medium mb-2">No tienes servicios creados</h3>
              <p className="text-muted-foreground mb-4">Comienza creando tu primer servicio</p>
              <Button onClick={() => router.push('/dashboard/provider/services/new')}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Crear Servicio
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {services.slice(0, 3).map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                  onClick={() => router.push(`/dashboard/provider/services/${service.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <div className="font-medium">{service.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {service.description.substring(0, 60)}...
                    </div>
                  </div>
                  <div className="font-medium">${service.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
