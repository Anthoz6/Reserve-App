"use client"

import type React from "react"
import type { User } from "@/types/user"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { RoleEnum } from "@/types/role"
import { usersService } from "@/lib/api/services/users_service"
import RoleBadge from "@/components/admin/RoleBadge"
import { RoleGuard } from "@/components/auth/role-guard"
import { Button } from "@/components/ui/button"
import {
  UserIcon,
  UsersIcon,
  ShieldCheckIcon,
  ActivityIcon,
  ArrowRightIcon,
  SettingsIcon,
} from "lucide-react"

const ROLES = [RoleEnum.ADMIN, RoleEnum.PROVIDER, RoleEnum.CUSTOMER]

export default function AdminDashboardPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.ADMIN]}>
      <AdminDashboardContent />
    </RoleGuard>
  )
}

function AdminDashboardContent() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoadingUsers(true)
    usersService
      .getAllUsers()
      .then((data) => setUsers(data))
      .catch(() => setError("Error al cargar usuarios"))
      .finally(() => setLoadingUsers(false))
  }, [])

  const byRole: Record<string, number> = {}
  ROLES.forEach((role) => {
    byRole[role] = users.filter((u: User) => String(u.role).toUpperCase() === role).length
  })

  const stats = {
    total: users.length,
    byRole,
  }

  const recentUsers = [...users].sort((a, b) => b.id - a.id).slice(0, 3)

  if (loadingUsers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border rounded-lg p-6 max-w-md">
          <div className="text-destructive text-center">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-foreground">Panel de Administrador</h1>
            <p className="text-muted-foreground">Gestiona usuarios y monitorea métricas del sistema</p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/admin/users")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Gestionar usuarios
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<UsersIcon className="w-5 h-5 text-chart-1" />}
            label="Total de usuarios"
            value={stats.total}
          />
          <StatCard
            icon={<ShieldCheckIcon className="w-5 h-5 text-chart-2" />}
            label="Administradores"
            value={stats.byRole.ADMIN}
          />
          <StatCard
            icon={<UserIcon className="w-5 h-5 text-chart-3" />}
            label="Proveedores"
            value={stats.byRole.PROVIDER}
          />
          <StatCard
            icon={<UserIcon className="w-5 h-5 text-chart-4" />}
            label="Clientes"
            value={stats.byRole.CUSTOMER}
          />
        </div>

        {/* Recent Users */}
        <div className="bg-card border rounded-lg">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-md">
                  <ActivityIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-card-foreground">Usuarios recientes</h2>
                  <p className="text-sm text-muted-foreground">Últimos registros en el sistema</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/admin/users")}
                className="text-muted-foreground hover:text-foreground"
              >
                Ver todos
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.map((u: User) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{u.name.slice(0, 1).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">{u.name}</div>
                      <div className="text-sm text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                  <RoleBadge role={String(u.role).toUpperCase()} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Minimalist StatCard component
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="bg-card border rounded-lg p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-muted rounded-md">{icon}</div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-semibold text-card-foreground">{value.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}