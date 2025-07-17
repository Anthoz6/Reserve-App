"use client"

import { RoleGuard } from '@/components/auth/role-guard'
import { RoleEnum } from '@/types/role'

export default function CustomerDashboardPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.CUSTOMER]}>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard de Cliente</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Catálogo de Servicios</h2>
            <p className="text-gray-600">Explora y reserva servicios disponibles</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Mis Reservas</h2>
            <p className="text-gray-600">Consulta y gestiona tus reservas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Perfil</h2>
            <p className="text-gray-600">Edita tu información personal</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}