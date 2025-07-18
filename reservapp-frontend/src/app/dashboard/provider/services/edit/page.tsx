'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RoleGuard } from '@/components/auth/role-guard';
import { RoleEnum } from '@/types/role';
import { servicesService } from '@/lib/api/services/services_service';
import { Service } from '@/types/service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Esquema de validación para el formulario
const serviceSchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder los 100 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder los 500 caracteres'),
  price: z.coerce.number().positive('El precio debe ser mayor que 0'),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function EditServicePage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.PROVIDER]}>
      <EditServiceContent />
    </RoleGuard>
  );
}

function EditServiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = Number(searchParams.get('id'));
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar el formulario con react-hook-form y zod
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
  });

  // Cargar el servicio cuando se monta el componente
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
          // Establecer los valores del formulario
          form.reset({
            title: foundService.title,
            description: foundService.description,
            price: foundService.price,
          });
        } else {
          setError('Servicio no encontrado o no tienes permisos para editarlo');
        }
      } catch (err) {
        setError('Error al cargar el servicio');
        console.error('Error loading service:', err);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [serviceId, form]);

  const onSubmit = async (data: ServiceFormValues) => {
    if (!service) return;

    setSaving(true);
    try {
      await servicesService.updateService(service.id, data);
      toast.success('Servicio actualizado correctamente');
      setTimeout(() => router.push('/dashboard/provider/services'), 1200);
    } catch (err) {
      toast.error('Error al actualizar el servicio');
      console.error('Error updating service:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !service) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-destructive/20 rounded-lg p-6 text-center">
            <p className="text-destructive mb-4">{error || 'Servicio no encontrado'}</p>
            <Button onClick={() => router.push('/dashboard/provider/services')} variant="outline">
              Volver a mis servicios
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Editar Servicio</h1>
          <p className="text-muted-foreground">Actualiza la información de tu servicio</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título del servicio</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={saving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-32" {...field} disabled={saving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} disabled={saving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/provider/services')}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
