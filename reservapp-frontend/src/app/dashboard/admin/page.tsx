import { RoleGuard } from '@/components/auth/role-guard'
import { RoleEnum } from '@/types/role'

export default function AdminDashboardPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.ADMIN]}>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard de Administrador</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
            <p className="text-gray-600">
              Administra los usuarios del sistema
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
            <p className="text-gray-600">
              Revisa las métricas del sistema
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Configuración</h2>
            <p className="text-gray-600">
              Configura el sistema
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
} 