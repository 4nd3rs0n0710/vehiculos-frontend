'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '@/lib/api'
import { isAdmin as checkAdmin, getUsername, clearTokens, isAuthenticated } from '@/lib/auth'
import FilterCards from '@/components/vehiculos/FilterCards'
import ViculoTable from '@/components/vehiculos/VehiculoTable'
import type { Vehicle, VehicleFormData } from '@/types'

export default function DashboardPage() {
  const router = useRouter()

  const [vehicles,   setVehicles]   = useState<Vehicle[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [editTarget, setEditTarget] = useState<Vehicle | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [admin,      setAdmin]      = useState(false)
  const [username,   setUsernameS]  = useState('')

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getVehicles()
      setVehicles(data)
    } catch {
      setError('Error cargando vehículos. Verifica tu conexión.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
      return
    }
    setAdmin(checkAdmin())
    setUsernameS(getUsername() || '')
    fetchVehicles()
  }, [router, fetchVehicles])

  const handleCreate = async (data: VehicleFormData) => {
    const newV = await createVehicle(data)
    setVehicles(prev => [newV, ...prev])
    setShowCreate(false)
  }

  const handleEdit = async (data: VehicleFormData) => {
    if (!editTarget) return
    const updated = await updateVehicle(editTarget.id, data)
    setVehicles(prev => prev.map(v => v.id === updated.id ? updated : v))
    setEditTarget(null)
  }

  const handleDelete = async (id: number) => {
    await deleteVehicle(id)
    setVehicles(prev => prev.filter(v => v.id !== id))
  }

  const handleLogout = () => {
    clearTokens()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header — fondo oscuro como el mockup */}
      <header className="bg-gray-900 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/Imagologo_motion.svg"
            alt="Motion"
            width={28}
            height={28}
            className="object-contain"
            style={{ width: '28px', height: 'auto' }}
          />
          <span
            className="font-bold text-white text-sm tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            Manager
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-semibold text-white">{username}</p>
            <p className="text-xs text-gray-400 capitalize">
              {admin ? 'Administrador' : 'Viewer'}
            </p>
          </div>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            title="Cerrar sesión"
          >
            <LogOut size={14} /> Salir
          </motion.button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <motion.div
          className="flex gap-6 h-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <FilterCards
            vehicles={vehicles}
            isAdmin={admin}
            editTarget={editTarget}
            showCreate={showCreate}
            onCreateToggle={() => { setShowCreate(v => !v); setEditTarget(null) }}
            onEditCancel={() => setEditTarget(null)}
            onSaveCreate={handleCreate}
            onSaveEdit={handleEdit}
          />

          <div className="flex-1 flex flex-col gap-3">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[#C6007E] text-sm">
                {error}
                <button onClick={fetchVehicles} className="ml-2 underline">
                  Reintentar
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <motion.div
                  className="w-10 h-10 border-4 border-[#C5C5C5] border-t-[#C6007E] rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            ) : (
              <ViculoTable
                vehicles={vehicles}
                isAdmin={admin}
                onEdit={(v) => { setEditTarget(v); setShowCreate(false) }}
                onDelete={handleDelete}
              />
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer — logo motion con imagen SVG */}
      <footer className="py-4 flex justify-center">
        <div className="flex items-center gap-1.5 opacity-50">
          <Image
            src="/Imagologo_motion.svg"
            alt="Motion"
            width={20}
            height={20}
            className="object-contain"
            style={{ width: '20px', height: 'auto' }}
          />
          <span className="text-sm font-black text-gray-500 italic tracking-wider">motion</span>
        </div>
      </footer>
    </div>
  )
}