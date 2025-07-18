'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import RoleBadge from './RoleBadge';
import {
  MoreHorizontalIcon,
  EditIcon,
  ShieldOffIcon,
  ShieldCheckIcon,
  UsersIcon,
  PlusIcon,
} from 'lucide-react';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onUserUpdate?: (user: User) => void;
  onUserDelete?: (userId: number) => void;
  searchTerm?: string;
  roleFilter?: string;
  onClearFilters?: () => void;
}

export default function UserTable({
  users,
  loading,
  onUserUpdate,
  onUserDelete,
  searchTerm,
  roleFilter,
  onClearFilters,
}: UserTableProps) {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });

  const handleToggleStatus = async (user: User) => {
    if (!onUserUpdate) return;

    try {
      setActionLoading(user.id);
      // Simulate API call - replace with actual service
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedUser = { ...user, enabled: !user.enabled };
      onUserUpdate(updatedUser);
    } catch (error) {
      console.error('Error toggling user status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteDialog.user || !onUserDelete) return;

    try {
      setActionLoading(deleteDialog.user.id);
      // Simulate API call - replace with actual service
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onUserDelete(deleteDialog.user.id);
      setDeleteDialog({ open: false, user: null });
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-4 border-b last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-md animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-48 animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 bg-muted rounded-full w-16 animate-pulse"></div>
                <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (users.length === 0) {
    const hasFilters = searchTerm || (roleFilter && roleFilter !== 'all');

    return (
      <div className="p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <UsersIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {hasFilters ? 'No se encontraron usuarios' : 'No hay usuarios'}
        </h3>
        <p className="text-muted-foreground mb-6">
          {hasFilters
            ? 'Intenta ajustar los filtros de búsqueda'
            : 'Comienza creando tu primer usuario'}
        </p>
        {hasFilters && onClearFilters ? (
          <Button variant="outline" onClick={onClearFilters}>
            Limpiar filtros
          </Button>
        ) : (
          <Button onClick={() => router.push('/dashboard/admin/users/new')}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Crear primer usuario
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Usuario</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Rol</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Estado</th>
              <th className="text-right py-4 px-6 font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b last:border-b-0 hover:bg-muted/20 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user.name.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <RoleBadge role={String(user.role).toUpperCase()} />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${user.enabled ? 'bg-chart-4' : 'bg-muted-foreground'}`}
                    />
                    <span
                      className={`text-sm ${user.enabled ? 'text-chart-4' : 'text-muted-foreground'}`}
                    >
                      {user.enabled ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={actionLoading === user.id}
                        >
                          <MoreHorizontalIcon className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/admin/users/edit?id=${user.id}`)}
                        >
                          <EditIcon className="w-4 h-4 mr-2" />
                          Editar usuario
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                          {user.enabled ? (
                            <>
                              <ShieldOffIcon className="w-4 h-4 mr-2" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <ShieldCheckIcon className="w-4 h-4 mr-2" />
                              Activar
                            </>
                          )}
                        </DropdownMenuItem>
                        {/* Eliminar usuario eliminado porque no hay endpoint */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open: boolean) => setDeleteDialog({ open, user: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta de{' '}
              <strong>{deleteDialog.user?.name}</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={actionLoading !== null}
            >
              {actionLoading === deleteDialog.user?.id ? 'Eliminando...' : 'Eliminar usuario'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
