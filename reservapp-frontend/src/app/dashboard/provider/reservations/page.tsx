'use client';

import { useEffect, useState } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import { RoleEnum } from '@/types/role';
import { reservationsService } from '@/lib/api/services/reservations_service';
import { Reservation, ReservationStatus } from '@/types/reservation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SearchIcon,
  FilterIcon,
  RefreshCwIcon,
  AlertTriangleIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
} from 'lucide-react';

export default function ProviderReservationsPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.PROVIDER]}>
      <ProviderReservationsContent />
    </RoleGuard>
  );
}

function ProviderReservationsContent() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Inicializar backendWarning como true directamente
  // Siempre mostrar la advertencia ya que esta funcionalidad está pendiente
  const [backendWarning] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(
        (reservation) =>
          (reservation.customer_name &&
            reservation.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (reservation.service_title &&
            reservation.service_title.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((reservation) => reservation.status === statusFilter);
    }

    setFilteredReservations(filtered);
  }, [reservations, searchTerm, statusFilter]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      // No modificamos backendWarning aquí, ya que lo mantenemos siempre en true

      try {
        // Intentamos cargar datos, pero sabemos que fallará porque la API no está implementada
        const data = await reservationsService.getProviderReservations();
        setReservations(data);
      } catch (err) {
        console.warn('Error al cargar reservas:', err);
        // No modificamos backendWarning aquí
        setReservations([]);
      }
    } catch (err) {
      setError('Error al cargar las reservas');
      console.error('Error loading reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reservas Recibidas</h1>
          <p className="text-muted-foreground">Gestiona las reservas para tus servicios</p>
        </div>
        <Button variant="outline" onClick={loadReservations} disabled={loading}>
          <RefreshCwIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Backend Warning */}
      {backendWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertTriangleIcon className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-amber-800 font-medium">Funcionalidad pendiente de implementación</p>
            <p className="text-amber-700 text-sm mt-1">
              La gestión de reservas para proveedores está pendiente de implementación en el
              backend. Las funcionalidades y datos mostrados son simulados.
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por cliente o servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={!!backendWarning}
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-muted-foreground" />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              disabled={!!backendWarning}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value={ReservationStatus.PENDING}>Pendientes</SelectItem>
                <SelectItem value={ReservationStatus.CONFIRMED}>Confirmadas</SelectItem>
                <SelectItem value={ReservationStatus.CANCELLED}>Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-card border border-destructive/20 rounded-lg p-6 text-center mb-6">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadReservations} variant="outline">
            Reintentar
          </Button>
        </div>
      )}

      {/* Empty State with Backend Warning - Siempre mostrar esta sección */}
      <div className="bg-card border rounded-lg p-12 text-center">
        <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-amber-100">
          <AlertTriangleIcon className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-xl font-medium mb-2">Funcionalidad en desarrollo</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          La gestión de reservas para proveedores está pendiente de implementación en el backend.
          Esta vista mostrará todas las reservas recibidas para tus servicios.
        </p>
        <div className="max-w-md mx-auto bg-muted/50 rounded-lg p-4 text-left">
          <h4 className="font-medium mb-2">Funcionalidades pendientes:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Ver todas las reservas para tus servicios</li>
            <li>Filtrar por estado (pendiente, confirmada, cancelada)</li>
            <li>Confirmar o rechazar reservas</li>
            <li>Ver detalles de cada reserva</li>
            <li>Recibir notificaciones de nuevas reservas</li>
          </ul>
        </div>
      </div>

      {/* Estas secciones no se mostrarán porque backendWarning siempre es true */}
      {!backendWarning && !error && filteredReservations.length === 0 && (
        <div className="bg-card border rounded-lg p-12 text-center">
          {searchTerm || statusFilter !== 'all' ? (
            <>
              <h3 className="text-lg font-medium mb-2">No se encontraron reservas</h3>
              <p className="text-muted-foreground mb-6">Intenta con otros filtros</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Limpiar filtros
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">No tienes reservas</h3>
              <p className="text-muted-foreground">
                Aún no has recibido reservas para tus servicios
              </p>
            </>
          )}
        </div>
      )}

      {/* Reservations List - No se mostrará porque backendWarning siempre es true */}
      {!backendWarning && filteredReservations.length > 0 && (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-card border rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">
                      {reservation.service_title || 'Servicio'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(reservation.date).toLocaleDateString()}</span>
                      <ClockIcon className="w-4 h-4 ml-2" />
                      <span>{reservation.time}</span>
                    </div>
                    <div className="text-sm mt-1">
                      Cliente:{' '}
                      <span className="font-medium">{reservation.customer_name || 'Cliente'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      reservation.status === ReservationStatus.CONFIRMED
                        ? 'bg-green-100 text-green-800'
                        : reservation.status === ReservationStatus.PENDING
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {reservation.status}
                  </span>

                  <div className="flex gap-2">
                    {reservation.status === ReservationStatus.PENDING && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
