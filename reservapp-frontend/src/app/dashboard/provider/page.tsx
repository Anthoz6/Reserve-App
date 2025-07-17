"use client"

import { RoleGuard } from '@/components/auth/role-guard'
import { RoleEnum } from '@/types/role'

export default function ProviderDashboardPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.PROVIDER]}>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard de Proveedor</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Mis Servicios</h2>
            <p className="text-gray-600">Administra tus servicios</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Reservas Recibidas</h2>
            <p className="text-gray-600">Gestiona las reservas de tus clientes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
            <p className="text-gray-600">Consulta tus métricas</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}