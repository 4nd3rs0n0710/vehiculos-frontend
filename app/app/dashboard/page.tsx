'use client'

/**
 * Página principal del dashboard.
 * 
 * Orquesta el estado global de la vista:
 * - Lista de vehículos cargada desde la API
 * - Control del formulario de creación/edición
 * - Operaciones CRUD con manejo de errores
 * - Protección de ruta (redirige al login si no hay sesión)
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '@/lib/api'
import { isAdmin as checkAdmin, getUsername, clearTokens, isAuthenticated } from '@/lib/auth'
import FilterCards from '@/components/vehiculos/FilterCards'
import ViculoTable from '@/components/vehiculos/VehiculoTable'
import type { Vehicle, VehicleFormData } from '@/types'

export default function DashboardPage() {
    const router = useRouter()

    // Estado principal de la vista
    const [vehicles,   setVehicles]   = useState<Vehicle[]>([])
    const [loading,    setLoading]    = useState(true)
    const [error,      setError]      = useState('')
    const [editTarget, setEditTarget] = useState<Vehicle | null>(null)
    const [showCreate, setShowCreate] = useState(false)

    // Datos del usuario autenticado
    const admin    = checkAdmin()
    const username = getUsername()

    // Verifica autenticación al montar el componente
    useEffect(() => {
    if (!isAuthenticated()) {
        router.replace('/login')
        return
    }
    fetchVehicles()
    }, [router])

  /** Carga la lista de vehículos desde el backend */
    const fetchVehicles = async () => {
    try {
        setLoading(true)
        const data = await getVehicles()
        setVehicles(data)
    } catch {
        setError('Error cargando vehículos. Verifica tu conexión.')
    } finally {
        setLoading(false)
    }
}

  /** Crea un vehículo y lo agrega al inicio de la lista sin recargar */
    const handleCreate = async (data: VehicleFormData) => {
        const newV = await createVehicle(data)
        setVehicles(prev => [newV, ...prev])
        setShowCreate(false)
    }

  /** Actualiza un vehículo en la lista local después de editar */
    const handleEdit = async (data: VehicleFormData) => {
        if (!editTarget) return
        const updated = await updateVehicle(editTarget.id, data)
        setVehicles(prev => prev.map(v => v.id === updated.id ? updated : v))
        setEditTarget(null)
    }

    /** Elimina un vehículo de la lista local después de borrarlo en el backend */
    const handleDelete = async (id: number) => {
        await deleteVehicle(id)
        setVehicles(prev => prev.filter(v => v.id !== id))
    }

    /** Cierra sesión limpiando cookies y redirigiendo al login */
    const handleLogout = () => {
        clearTokens()
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* Barra de navegación superior */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#40CEE4] to-[#C6007E] flex items-center justify-center">
                <span className="text-white font-black text-sm">M</span>
            </div>
            <span className="font-bold text-[#00249C] text-sm tracking-wide">MANAGER</span>
        </div>

        {/* Info del usuario y botón de logout */}
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-xs font-semibold text-gray-700">{username}</p>
                <p className="text-xs text-[#C5C5C5] capitalize">
                {admin ? 'Administrador' : 'Viewer'}
                </p>
            </div>
            <motion.button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-[#C5C5C5] hover:text-[#C6007E] transition-colors font-medium"
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
          {/* Panel izquierdo: cards de info + formulario */}
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

            {/* Panel derecho: tabla de vehículos */}
            <div className="flex-1 flex flex-col gap-3">

            {/* Error de carga con opción de reintentar */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[#C6007E] text-sm">
                    {error}
                <button onClick={fetchVehicles} className="ml-2 underline">
                    Reintentar
                </button>
                </div>
            )}

            {/* Spinner de carga */}
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

      {/* Footer con logo de Motion */}
        <footer className="py-4 flex justify-center">
        <div className="flex items-center gap-1.5 opacity-40">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#40CEE4] to-[#C6007E]" />
            <span className="text-sm font-black text-gray-500 italic">motion</span>
        </div>
        </footer>
    </div>
    )
}