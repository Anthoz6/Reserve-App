"use client"

import { useEffect, useState } from "react"
import { RoleGuard } from '@/components/auth/role-guard'
import { RoleEnum } from '@/types/role'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { reservationsService } from "@/lib/api/services/reservations_service"
import { servicesService } from "@/lib/api/services/services_service"
import { Reservation, ReservationStatus } from "@/types/reservation"
import { Service } from "@/types/service"
import {
  CalendarIcon,
  ShoppingBagIcon,
  SearchIcon,
  ArrowRightIcon,
  ClockIcon,
  UserIcon
} from "lucide-react"

export default function CustomerDashboardPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.CUSTOMER]}>
      <CustomerDashboardContent />
    </RoleGuard>
  )
}

function CustomerDashboardContent() {
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Cargar servicios primero (más importante para el dashboard)
        try {
          console.log("Cargando servicios...")
          const servicesData = await servicesService.getAllServices()
          console.log("Servicios cargados:", servicesData)
          setServices(servicesData)
        } catch (serviceError) {
          console.error("Error loading services:", serviceError)
          setServices([])
        }

        // Cargar reservas (opcional)
        try {
          console.log("Cargando reservas...")
          const reservationsData = await reservationsService.getMyReservations()
          console.log("Reservas cargadas:", reservationsData)
          setReservations(reservationsData)
        } catch (reservationError) {
          console.error("Error loading reservations:", reservationError)
          setReservations([])
        }

      } catch (err) {
        console.error("Error general:", err)
        setError("Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard de Cliente</h1>
          <p className="text-muted-foreground">Explora servicios y gestiona tus reservas</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/customer/services")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <SearchIcon className="w-4 h-4 mr-2" />
          Explorar Servicios
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-card border border-destructive/20 rounded-lg p-6 text-center mb-6">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-muted rounded-md">
              <CalendarIcon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-card-foreground">
              {loading ? "..." : reservations.length}
            </div>
            <div className="text-sm text-muted-foreground">Total de Reservas</div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-muted rounded-md">
              <ClockIcon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-card-foreground">
              {loading ? "..." : reservations.filter(r => r.status === ReservationStatus.PENDING).length}
            </div>
            <div className="text-sm text-muted-foreground">Reservas Pendientes</div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-muted rounded-md">
              <ShoppingBagIcon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-card-foreground">
              {loading ? "..." : services.length}
            </div>
            <div className="text-sm text-muted-foreground">Servicios Disponibles</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          className="bg-card border rounded-lg p-6 hover:shadow-sm transition-shadow cursor-pointer"
          onClick={() => router.push("/dashboard/customer/services")}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Catálogo de Servicios</h3>
              <p className="text-muted-foreground">Explora y reserva servicios disponibles</p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <div
          className="bg-card border rounded-lg p-6 hover:shadow-sm transition-shadow cursor-pointer"
          onClick={() => router.push("/dashboard/customer/reservations")}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Mis Reservas</h3>
              <p className="text-muted-foreground">Consulta y gestiona tus reservas</p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Reservas Recientes</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/customer/reservations")}
            >
              Ver todas
            </Button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center p-8">
              <h3 className="text-lg font-medium mb-2">Cargando reservas...</h3>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center p-8">
              <h3 className="text-lg font-medium mb-2">No tienes reservas aún</h3>
              <p className="text-muted-foreground mb-4">Explora nuestro catálogo y haz tu primera reserva</p>
              <Button
                onClick={() => router.push("/dashboard/customer/services")}
              >
                <SearchIcon className="w-4 h-4 mr-2" />
                Explorar Servicios
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.slice(0, 3).map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{reservation.service?.title || "Servicio"}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(reservation.date).toLocaleDateString()} - {reservation.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${reservation.status === ReservationStatus.CONFIRMED
                      ? 'bg-green-100 text-green-800'
                      : reservation.status === ReservationStatus.PENDING
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {reservation.status}
                    </span>
                    <span className="font-medium">${reservation.service?.price?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}