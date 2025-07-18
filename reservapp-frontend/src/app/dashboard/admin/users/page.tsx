'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersService } from '@/lib/api/services/users_service';
import type { User } from '@/types/user';
import { RoleEnum } from '@/types/role';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import UserTable from '@/components/admin/UserTable';
import { RoleGuard } from '@/components/auth/role-guard';
import { PlusIcon, SearchIcon, FilterIcon, RefreshCwIcon } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.ADMIN]}>
      <AdminUsersContent />
    </RoleGuard>
  );
}

function AdminUsersContent() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => String(user.role).toUpperCase() === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handleUserDelete = (userId: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-foreground">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">
              Administra todos los usuarios del sistema
              {!loading && ` (${filteredUsers.length} de ${users.length})`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={loadUsers} disabled={loading}>
              <RefreshCwIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button
              onClick={() => router.push('/dashboard/admin/users/new')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Crear usuario
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <FilterIcon className="w-4 h-4 text-muted-foreground" />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value={RoleEnum.ADMIN}>Administradores</SelectItem>
                  <SelectItem value={RoleEnum.PROVIDER}>Proveedores</SelectItem>
                  <SelectItem value={RoleEnum.CUSTOMER}>Clientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-card border border-destructive/20 rounded-lg p-6 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadUsers} variant="outline">
              Reintentar
            </Button>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <UserTable
            users={filteredUsers}
            loading={loading}
            onUserUpdate={handleUserUpdate}
            onUserDelete={handleUserDelete}
            searchTerm={searchTerm}
            roleFilter={roleFilter}
            onClearFilters={() => {
              setSearchTerm('');
              setRoleFilter('all');
            }}
          />
        </div>
      </div>
    </div>
  );
}
