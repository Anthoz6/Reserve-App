"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RoleGuard } from "@/components/auth/role-guard"
import { RoleEnum } from "@/types/role"
import { servicesService } from "@/lib/api/services/services_service"
import { Service } from "@/types/service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading"
import { toast } from "sonner"
import { 
  PlusIcon, 
  SearchIcon, 
  EditIcon, 
  TrashIcon, 
  RefreshCwIcon,
  MoreHorizontalIcon
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ProviderServicesPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.PROVIDER]}>
      <ProviderServicesContent />
    </RoleGuard>
  )
}

function ProviderServicesContent() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; service: Service | null }>({
    open: false,
    service: null,
  })
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    loadServices()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      setFilteredServices(
        services.filter(
          (service) =>
            service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredServices(services)
    }
  }, [services, searchTerm])

  const loadServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await servicesService.getMyServices()
      setServices(data)
    } catch (err) {
      setError("Error al cargar los servicios")
      console.error("Error loading services:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteService = async () => {
    if (!deleteDialog.service) return

    try {
      setActionLoading(deleteDialog.service.id)
      await servicesService.deleteService(deleteDialog.service.id)
      toast.success("Servicio eliminado correctamente")
      setServices((prev) => prev.filter((s) => s.id !== deleteDialog.service?.id))
      setDeleteDialog({ open: false, service: null })
    } catch (err) {
      toast.error("Error al eliminar el servicio")
      console.error("Error deleting service:", err)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis Servicios</h1>
          <p className="text-muted-foreground">Gestiona los servicios que ofreces</p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard/provider/services/new")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Crear Servicio
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={loadServices} disabled={loading}>
            <RefreshCwIcon className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
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
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Limpiar búsqueda
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">No tienes servicios creados</h3>
              <p className="text-muted-foreground mb-6">Comienza creando tu primer servicio</p>
              <Button onClick={() => router.push("/dashboard/provider/services/new")}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Crear Servicio
              </Button>
            </>
          )}
        </div>
      )}

      {/* Services List */}
      {filteredServices.length > 0 && (
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Servicio</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Descripción</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Precio</th>
                  <th className="text-right py-4 px-6 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium">{service.title}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {service.description}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">${service.price.toFixed(2)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={actionLoading === service.id}>
                              <MoreHorizontalIcon className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/provider/services/edit?id=${service.id}`)}>
                              <EditIcon className="w-4 h-4 mr-2" />
                              Editar servicio
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeleteDialog({ open: true, service })}
                              className="text-destructive focus:text-destructive"
                            >
                              <TrashIcon className="w-4 h-4 mr-2" />
                              Eliminar servicio
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, service: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el servicio{" "}
              <strong>{deleteDialog.service?.title}</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={actionLoading !== null}
            >
              {actionLoading === deleteDialog.service?.id ? "Eliminando..." : "Eliminar servicio"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}