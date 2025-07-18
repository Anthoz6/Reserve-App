'use client';

import { useEffect, useState } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import { RoleEnum } from '@/types/role';
import { servicesService } from '@/lib/api/services/services_service';
import { reservationsService } from '@/lib/api/services/reservations_service';
import { Service } from '@/types/service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { SearchIcon, CalendarIcon, UserIcon, RefreshCwIcon } from 'lucide-react';

export default function CustomerServicesPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.CUSTOMER]}>
      <CustomerServicesContent />
    </RoleGuard>
  );
}

function CustomerServicesContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [reservationDialog, setReservationDialog] = useState<{
    open: boolean;
    service: Service | null;
  }>({
    open: false,
    service: null,
  });
  const [reservationForm, setReservationForm] = useState({
    date: '',
    time: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredServices(
        services.filter(
          (service) =>
            service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (service.provider?.name &&
              service.provider.name.toLowerCase().includes(searchTerm.toLowerCase())),
        ),
      );
    } else {
      setFilteredServices(services);
    }
  }, [services, searchTerm]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await servicesService.getAllServices();
      setServices(data);
    } catch (err: unknown) {
      setError('Error al cargar los servicios');
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReserveService = (service: Service) => {
    setReservationDialog({ open: true, service });
    setReservationForm({ date: '', time: '' });
  };

  const handleSubmitReservation = async () => {
    if (!reservationDialog.service || !reservationForm.date || !reservationForm.time) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    // Validar que la fecha sea futura
    const selectedDate = new Date(reservationForm.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    if (selectedDate <= today) {
      toast.error('La fecha debe ser futura');
      return;
    }

    try {
      setSubmitting(true);

      const reservationData = {
        service_id: reservationDialog.service.id, // Backend usa SNAKE_CASE
        date: reservationForm.date,
        time: reservationForm.time.includes(':00')
          ? reservationForm.time
          : reservationForm.time + ':00',
      };

      console.log('Enviando reserva:', reservationData);

      await reservationsService.createReservation(reservationData);

      toast.success('Reserva creada exitosamente');
      setReservationDialog({ open: false, service: null });
      setReservationForm({ date: '', time: '' });
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: unknown }).response === 'object'
      ) {
        const response = (err as { response?: ReservationErrorResponse }).response;
        console.error('Error response:', response?.data);
        console.error('Error status:', response?.status);
        console.error('Error details:', response?.data?.details);

        // Mostrar mensaje de error más específico
        if (response?.status === 400) {
          const errorData = response.data;
          let errorMessage: string = 'Datos de reserva inválidos';

          // Extraer detalles específicos de validación
          if (
            errorData?.details &&
            Array.isArray(errorData.details) &&
            errorData.details.length > 0
          ) {
            const firstDetail = errorData.details[0];
            if (typeof firstDetail === 'string') {
              errorMessage = String(firstDetail);
            } else if (firstDetail?.message) {
              errorMessage = String(firstDetail.message);
            } else if (firstDetail?.field && firstDetail?.defaultMessage) {
              errorMessage = String(`${firstDetail.field}: ${firstDetail.defaultMessage}`);
            } else {
              errorMessage = String(JSON.stringify(firstDetail));
            }
          } else if (errorData?.message) {
            errorMessage = String(errorData.message);
          } else if (errorData?.error) {
            errorMessage = String(errorData.error);
          } else if (typeof errorData === 'string') {
            errorMessage = String(errorData);
          } else if (typeof errorData === 'object' && errorData !== null) {
            const json = String(JSON.stringify(errorData));
            if (json !== '{}' && json !== '[]') {
              errorMessage = String(json);
            } else {
              errorMessage = 'Error desconocido al crear la reserva';
            }
          }

          console.log('Showing error message:', errorMessage);
          toast.error(errorMessage);
        } else {
          console.error('Error creando reserva:', err);
          toast.error('Error al crear la reserva');
        }
      } else {
        console.error('Error creando reserva:', err);
        toast.error('Error al crear la reserva');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Catálogo de Servicios</h1>
          <p className="text-muted-foreground">Explora y reserva servicios disponibles</p>
        </div>
        <Button variant="outline" onClick={loadServices} disabled={loading}>
          <RefreshCwIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Search */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por título, descripción o proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-card border border-destructive/20 rounded-lg p-6 text-center mb-6">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadServices} variant="outline">
            Reintentar
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!error && filteredServices.length === 0 && (
        <div className="bg-card border rounded-lg p-12 text-center">
          {searchTerm ? (
            <>
              <h3 className="text-lg font-medium mb-2">No se encontraron servicios</h3>
              <p className="text-muted-foreground mb-6">Intenta con otra búsqueda</p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Limpiar búsqueda
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">No hay servicios disponibles</h3>
              <p className="text-muted-foreground">Vuelve más tarde para ver nuevos servicios</p>
            </>
          )}
        </div>
      )}

      {/* Services Grid */}
      {filteredServices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-card border rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground">{service.title}</h3>
                  <span className="text-lg font-bold text-primary">
                    ${service.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {service.description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {service.provider?.name || 'Proveedor'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {service.provider?.email || 'Sin email'}
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleReserveService(service)} className="w-full">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Reservar Servicio
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reservation Dialog */}
      <Dialog
        open={reservationDialog.open}
        onOpenChange={(open) => setReservationDialog({ open, service: null })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reservar Servicio</DialogTitle>
            <DialogDescription>
              Completa los datos para reservar: <strong>{reservationDialog.service?.title}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={reservationForm.date}
                onChange={(e) =>
                  setReservationForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={reservationForm.time}
                onChange={(e) =>
                  setReservationForm((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }))
                }
              />
            </div>

            {reservationDialog.service && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Precio del servicio:</span>
                  <span className="font-semibold">
                    ${reservationDialog.service.price.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReservationDialog({ open: false, service: null })}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitReservation}
              disabled={submitting || !reservationForm.date || !reservationForm.time}
            >
              {submitting ? 'Creando...' : 'Confirmar Reserva'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type ReservationErrorResponse = {
  data?: {
    details?: string;
    message?: string;
    [key: string]: unknown;
  };
  status?: number;
  [key: string]: unknown;
};
