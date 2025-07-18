"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RoleGuard } from "@/components/auth/role-guard"
import { RoleEnum } from "@/types/role"
import { reservationsService } from "@/lib/api/services/reservations_service"
import { Reservation, ReservationStatus } from "@/types/reservation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  SearchIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  RefreshCwIcon,
  FilterIcon,
  PlusIcon
} from "lucide-react"

export default function CustomerReservationsPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.CUSTOMER]}>
      <CustomerReservationsContent />
    </RoleGuard>
  )
}

function CustomerReservationsContent() {
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadReservations()
  }, [])

  useEffect(() => {
    let filtered = reservations

    if (searchTerm) {
      filtered = filtered.filter(
        (reservation) =>
          (reservation.service?.title && reservation.service.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (reservation.provider?.name && reservation.provider.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((reservation) => reservation.status === statusFilter)
    }

    setFilteredReservations(filtered)
  }, [reservations, searchTerm, statusFilter])

  const loadReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await reservationsService.getMyReservations()
      setReservations(data)
    } catch (err) {
      setError("Error al cargar las reservas")
      console.error("Error loading reservations:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: ReservationStatus) => {
    const statusConfig = {
      [ReservationStatus.PENDING]: {
        className: "bg-yellow-100 text-yellow-800",
        label: "Pendiente"
      },
      [ReservationStatus.CONFIRMED]: {
        className: "bg-green-100 text-green-800",
        label: "Confirmada"
      },
      [ReservationStatus.CANCELLED]: {
        className: "bg-red-100 text-red-800",
        label: "Cancelada"
      }
    }

    const config = statusConfig[status]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5) // Remove seconds
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis Reservas</h1>
          <p className="text-muted-foreground">
            Consulta y gestiona tus reservas
            {!loading && ` (${filteredReservations.length} de ${reservations.length})`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={loadReservations} disabled={loading}>
            <RefreshCwIcon className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button
            onClick={() => router.push("/dashboard/customer/services")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nueva Reserva
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por servicio o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value={ReservationStatus.PENDING}>Pendientes</SelectItem>
                <SelectItem value={ReservationStatus.CONFIRMED}>Confirmadas</SelectItem>
                <SelectItem value={ReservationStatus.CANCELLED}>Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-card border border-destructive/20 rounded-lg p-6 text-center mb-6">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadReservations} variant="outline">
            Reintentar
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!error && filteredReservations.length === 0 && (
        <div className="bg-card border rounded-lg p-12 text-center">
          {searchTerm || statusFilter !== "all" ? (
            <>
              <h3 className="text-lg font-medium mb-2">No se encontraron reservas</h3>
              <p className="text-muted-foreground mb-6">Intenta ajustar los filtros de búsqueda</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
              }}>
                Limpiar filtros
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">No tienes reservas aún</h3>
              <p className="text-muted-foreground mb-6">Explora nuestro catálogo y haz tu primera reserva</p>
              <Button onClick={() => router.push("/dashboard/customer/services")}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Explorar Servicios
              </Button>
            </>
          )}
        </div>
      )}

      {/* Reservations List */}
      {filteredReservations.length > 0 && (
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Servicio</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Proveedor</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Fecha y Hora</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Precio</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium">{reservation.service?.title || "Servicio"}</div>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {reservation.service?.description || "Sin descripción"}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{reservation.provider?.name || "Proveedor"}</div>
                          <div className="text-xs text-muted-foreground">{reservation.provider?.email || "Sin email"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDate(reservation.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClockIcon className="w-4 h-4" />
                        <span>{formatTime(reservation.time)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">${reservation.service?.price?.toFixed(2) || "0.00"}</div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(reservation.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}