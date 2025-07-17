'use client'
// Componente de gestión de usuarios para el dashboard de admin
// Permite crear y actualizar usuarios mediante formularios separados

import { useState } from 'react'
import { usersService } from '@/lib/api/services'
import { Badge } from '@/components/ui/badge'
import React from 'react'

export default function UserManagement() {
  // Estado para tab activo: 'create' o 'update'
  const [activeTab, setActiveTab] = useState<'create' | 'update'>('create')

  // --- Estados para crear usuario ---
  const [createData, setCreateData] = useState({ name: '', email: '', password: '', roleId: '' })
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createSuccess, setCreateSuccess] = useState<string | null>(null)

  // --- Estados para actualizar usuario ---
  const [updateId, setUpdateId] = useState('')
  const [updateData, setUpdateData] = useState({ name: '', email: '', enabled: true })
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)

  // Maneja el submit del formulario de creación
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)
    setCreateSuccess(null)
    setCreateLoading(true)
    try {
      console.log('[UserManagement] Creando usuario con datos:', createData)
      await usersService.createUser({
        ...createData,
        rol_id: Number(createData.roleId), // <- cambio aquí
      })
      setCreateSuccess('Usuario creado exitosamente')
      setCreateData({ name: '', email: '', password: '', roleId: '' })
      console.log('[UserManagement] Usuario creado exitosamente')
      localStorage.removeItem('userManagementError')
    } catch (err) {
      const errorMsg = 'Error al crear usuario: ' + (err instanceof Error ? err.message : JSON.stringify(err))
      setCreateError(errorMsg)
      localStorage.setItem('userManagementError', errorMsg)
      console.error('[UserManagement] Error al crear usuario:', err)
    } finally {
      setCreateLoading(false)
    }
  }

  // Maneja el submit del formulario de actualización
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateError(null)
    setUpdateSuccess(null)
    if (!updateId) {
      setUpdateError('Debes ingresar el ID del usuario')
      return
    }
    setUpdateLoading(true)
    try {
      console.log('[UserManagement] Actualizando usuario ID:', updateId, 'con datos:', updateData)
      await usersService.updateUser(Number(updateId), updateData)
      setUpdateSuccess('Usuario actualizado exitosamente')
      setUpdateId('')
      setUpdateData({ name: '', email: '', enabled: true })
      console.log('[UserManagement] Usuario actualizado exitosamente')
      localStorage.removeItem('userManagementError')
    } catch (err) {
      const errorMsg = 'Error al actualizar usuario: ' + (err instanceof Error ? err.message : JSON.stringify(err))
      setUpdateError(errorMsg)
      localStorage.setItem('userManagementError', errorMsg)
      console.error('[UserManagement] Error al actualizar usuario:', err)
    } finally {
      setUpdateLoading(false)
    }
  }

  // Mostrar error persistente si existe en localStorage
  React.useEffect(() => {
    const storedError = localStorage.getItem('userManagementError')
    if (storedError) {
      setCreateError(storedError)
      setUpdateError(storedError)
      // Limpia el error después de mostrarlo una vez
      localStorage.removeItem('userManagementError')
    }
  }, [])

  return (
    <div>
      {/* Tabs para alternar entre crear y actualizar */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-t ${activeTab === 'create' ? 'bg-zinc-800 text-white' : 'bg-zinc-200'}`}
          onClick={() => setActiveTab('create')}
        >
          Crear usuario
        </button>
        <button
          className={`px-4 py-2 rounded-t ${activeTab === 'update' ? 'bg-zinc-800 text-white' : 'bg-zinc-200'}`}
          onClick={() => setActiveTab('update')}
        >
          Actualizar usuario
        </button>
      </div>

      {/* Formulario para crear usuario */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreate} className="space-y-3 bg-white p-4 rounded shadow">
          <div>
            <label htmlFor="create-name" className="block font-semibold">Nombre</label>
            <input
              id="create-name"
              name="create-name"
              type="text"
              required
              value={createData.name}
              onChange={e => setCreateData(d => ({ ...d, name: e.target.value }))}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="create-email" className="block font-semibold">Email</label>
            <input
              id="create-email"
              name="create-email"
              type="email"
              required
              value={createData.email}
              onChange={e => setCreateData(d => ({ ...d, email: e.target.value }))}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="create-password" className="block font-semibold">Contraseña</label>
            <input
              id="create-password"
              name="create-password"
              type="password"
              required
              value={createData.password}
              onChange={e => setCreateData(d => ({ ...d, password: e.target.value }))}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="create-roleId" className="block font-semibold">ID de Rol</label>
            <input
              id="create-roleId"
              name="create-roleId"
              type="number"
              required
              value={createData.roleId}
              onChange={e => setCreateData(d => ({ ...d, roleId: e.target.value }))}
              className="border rounded px-2 py-1 w-full"
            />
            <div className="text-xs text-gray-500 mt-1">Ejemplo: 1=ADMIN, 2=PROVIDER, 3=CUSTOMER</div>
          </div>
          {createError && <div className="text-red-500">{createError}</div>}
          {createSuccess && <div className="text-green-600">{createSuccess}</div>}
          <button
            type="submit"
            className="bg-zinc-800 text-white px-4 py-2 rounded hover:bg-zinc-700"
            disabled={createLoading}
          >
            {createLoading ? 'Creando...' : 'Crear usuario'}
          </button>
        </form>
      )}

      {/* Formulario para actualizar usuario */}
      {activeTab === 'update' && (
        <form onSubmit={handleUpdate} className="space-y-3 bg-white p-4 rounded shadow">
          <div>
            <label htmlFor="update-id" className="block font-semibold">ID de usuario</label>
            <input
              id="update-id"
              name="update-id"
              type="number"
              required
              value={updateId}
              onChange={e => setUpdateId(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="update-name" className="block font-semibold">Nombre</label>
            <input
              id="update-name"
              name="update-name"
              type="text"
              value={updateData.name}
              onChange={e => setUpdateData(d => ({ ...d, name: e.target.value }))}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="update-email" className="block font-semibold">Email</label>
            <input
              id="update-email"
              name="update-email"
              type="email"
              value={updateData.email}
              onChange={e => setUpdateData(d => ({ ...d, email: e.target.value }))}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="update-enabled" className="block font-semibold">Estado</label>
            <select
              id="update-enabled"
              name="update-enabled"
              value={updateData.enabled ? 'activo' : 'suspendido'}
              onChange={e => setUpdateData(d => ({ ...d, enabled: e.target.value === 'activo' }))}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="activo">Activo</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>
          {updateError && <div className="text-red-500">{updateError}</div>}
          {updateSuccess && <div className="text-green-600">{updateSuccess}</div>}
          <button
            type="submit"
            className="bg-zinc-800 text-white px-4 py-2 rounded hover:bg-zinc-700"
            disabled={updateLoading}
          >
            {updateLoading ? 'Actualizando...' : 'Actualizar usuario'}
          </button>
        </form>
      )}
    </div>
  )
} 