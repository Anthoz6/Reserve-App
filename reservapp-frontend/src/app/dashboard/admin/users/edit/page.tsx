'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usersService } from '@/lib/api/services/users_service';
import type { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { RoleGuard } from '@/components/auth/role-guard';
import { RoleEnum } from '@/types/role';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ROLES = [
  { label: 'ADMIN', value: 1 },
  { label: 'PROVIDER', value: 2 },
  { label: 'CUSTOMER', value: 3 },
];

export default function EditUserPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.ADMIN]}>
      <EditUserContent />
    </RoleGuard>
  );
}

function EditUserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = Number(searchParams.get('id'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState<number>(1);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    usersService
      .getAllUsers()
      .then((users) => {
        const found = users.find((u) => u.id === userId);
        setUser(found || null);
        setRoleId(found?.role?.id ?? 1);
      })
      .catch(() => toast.error('No se pudo cargar el usuario'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleToggleEnabled = (value: boolean) => {
    if (!user) return;
    setUser({ ...user, enabled: value });
  };

  const handleRoleChange = (value: string) => {
    setRoleId(Number(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // NOTA: Funcionalidad de edición comentada temporalmente debido a problemas con el backend
    // Pendiente de revisión por el equipo de backend
    toast.info('La edición de usuarios está temporalmente deshabilitada');

    /* Código original comentado
    if (!user) return
    setSaving(true)
    try {
      const payload = {
        name: user.name || "",
        email: user.email || ""
      }
      
      console.log("Enviando payload:", payload);
      await usersService.updateUser(user.id, payload)
      
      toast.success("Usuario actualizado correctamente")
      setTimeout(() => router.push("/dashboard/admin/users"), 1200)
    } catch (err) {
      toast.error("Error al actualizar usuario")
      console.error("Error al actualizar usuario:", err)
    } finally {
      setSaving(false)
    }
    */
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando usuario...</div>;
  }
  if (!user) {
    return <div className="text-center text-destructive mt-12">Usuario no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-card border rounded-lg p-8 w-full max-w-md space-y-6 shadow"
      >
        <h1 className="text-2xl font-bold mb-2">Editar usuario</h1>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Nombre</label>
          <Input name="name" value={user.name} onChange={handleChange} required disabled={false} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Email</label>
          <Input
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            required
            disabled={false}
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={user.enabled} onCheckedChange={handleToggleEnabled} disabled={false} />
          <span className={user.enabled ? 'text-chart-4' : 'text-muted-foreground'}>
            {user.enabled ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Rol</label>
          <Select
            value={roleId ? String(roleId) : undefined}
            onValueChange={handleRoleChange}
            disabled={false}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role.value} value={String(role.value)}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/admin/users')}
            disabled={false}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={false}>
            Guardar cambios
          </Button>
        </div>
        <div className="text-center text-amber-500 mt-4 p-2 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm">⚠️ La edición de usuarios está temporalmente deshabilitada</p>
          <p className="text-xs mt-1">Pendiente de revisión por el equipo de backend</p>
        </div>
      </form>
    </div>
  );
}
