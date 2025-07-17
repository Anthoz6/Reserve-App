"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { usersService } from "@/lib/api/services/users_service"
import { RoleEnum } from "@/types/role"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RoleGuard } from "@/components/auth/role-guard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ROLES = [
  { label: "ADMIN", value: "1" },
  { label: "CUSTOMER", value: "2" },
  { label: "PROVIDER", value: "3" },
]

export default function NewUserPage() {
  return (
    <RoleGuard requiredRoles={[RoleEnum.ADMIN]}>
      <NewUserContent />
    </RoleGuard>
  )
}

function NewUserContent() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rol_id: "1", // valor por defecto como string
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRoleChange = (value: string) => {
    setForm({ ...form, rol_id: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await usersService.createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        rol_id: Number(form.rol_id), // convertir a number aquí
      })
      toast.success("Usuario creado correctamente")
      setTimeout(() => router.push("/dashboard/admin/users"), 1200)
    } catch (err) {
      toast.error("Error al crear usuario")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-card border rounded-lg p-8 w-full max-w-md space-y-6 shadow"
      >
        <h1 className="text-2xl font-bold mb-2">Crear usuario</h1>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Nombre</label>
          <Input name="name" value={form.name} onChange={handleChange} required disabled={saving} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Email</label>
          <Input name="email" type="email" value={form.email} onChange={handleChange} required disabled={saving} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Contraseña</label>
          <Input name="password" type="password" value={form.password} onChange={handleChange} required disabled={saving} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Rol</label>
          <Select value={form.rol_id} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/admin/users")} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            Crear usuario
          </Button>
        </div>
      </form>
    </div>
  )
}