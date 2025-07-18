'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RoleGuard } from '@/components/auth/role-guard';
import { RoleEnum } from '@/types/role';
import { servicesService } from '@/lib/api/services/services_service';
import { Service } from '@/types/service';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import { toast } from 'sonner';
import {
  ArrowLeftIcon,
  EditIcon,
  TrashIcon,
  CalendarIcon,
  DollarSignIcon,
  UserIcon,
  AlertTriangleIcon,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ServiceDetailPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.PROVIDER]}>
      <ServiceDetailContent />
    </RoleGuard>
  );
}

function ServiceDetailContent() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.id);

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadService = async () => {
      if (!serviceId) return;

      try {
        setLoading(true);
        setError(null);
        // Obtenemos todos los servicios del proveedor y filtramos por ID
        const services = await servicesService.getMyServices();
        const foundService = services.find((s) => s.id === serviceId);

        if (foundService) {
          setService(foundService);
        } else {
          setError('Servicio no encontrado o no tienes permisos para verlo');
        }
      } catch (err) {
        setError('Error al cargar el servicio');
        console.error('Error loading service:', err);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [serviceId]);

  const handleDeleteService = async () => {
    if (!service) return;

    try {
      setActionLoading(true);
      await servicesService.deleteService(service.id);
      toast.success('Servicio eliminado correctamente');
      setTimeout(() => router.push('/dashboard/provider/services'), 1200);
    } catch (err) {
      toast.error('Error al eliminar el servicio');
      console.error('Error deleting service:', err);
    } finally {
      setActionLoading(false);
      setDeleteDialog(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !service) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-destructive/20 rounded-lg p-6 text-center">
            <p className="text-destructive mb-4">{error || 'Servicio no encontrado'}</p>
            <Button onClick={() => router.push('/dashboard/provider/services')} variant="outline">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Volver a mis servicios
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/provider/services')}
          className="mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Volver a mis servicios
        </Button>

        {/* Service Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
            <p className="text-muted-foreground">ID: {service.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/provider/services/edit?id=${service.id}`)}
            >
              <EditIcon className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteDialog(true)}
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-card border rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Detalles del servicio</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-md">
                  <DollarSignIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Precio</div>
                  <div className="font-medium">${service.price.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-md">
                  <UserIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Proveedor</div>
                  <div className="font-medium">{service.provider?.name || 'Tú'}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Descripción</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{service.description}</p>
            </div>
          </div>
        </div>

        {/* Reservations Section */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Reservas para este servicio</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/provider/reservations')}
              >
                Ver todas las reservas
              </Button>
            </div>
          </div>

          <div className="p-6">
            {/* Backend Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertTriangleIcon className="w-5 h-5 text-amber-500" />
              <p className="text-amber-800">
                La gestión de reservas para proveedores está pendiente de implementación en el
                backend
              </p>
            </div>

            <div className="text-center p-8">
              <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-muted">
                <CalendarIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Funcionalidad en desarrollo</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Aquí podrás ver todas las reservas específicas para este servicio cuando el backend
                implemente esta funcionalidad.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el servicio{' '}
              <strong>{service.title}</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={actionLoading}
            >
              {actionLoading ? 'Eliminando...' : 'Eliminar servicio'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
