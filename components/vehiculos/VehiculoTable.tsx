'use client'

/**
 * Tabla principal de vehículos.
 * 
 * Muestra el listado con animaciones de entrada por fila.
 * Al eliminar, anima la fila hacia la derecha antes de removerla
 * para dar feedback visual al usuario.
 * 
 * Los botones de editar y eliminar solo se muestran si el usuario es admin.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import type { Vehicle } from '@/types'

interface Props {
    vehicles: Vehicle[]
    isAdmin:  boolean
    onEdit:   (v: Vehicle) => void
    onDelete: (id: number) => Promise<void>
}

export default function ViculoTable({ vehicles, isAdmin, onEdit, onDelete }: Props) {
    // ID del vehículo que está siendo eliminado (para la animación)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const handleDelete = async (v: Vehicle) => {
        if (!confirm(`¿Eliminar "${v.brand}"?`)) return

        // Activa la animación de salida antes de llamar al backend
        setDeletingId(v.id)
        setTimeout(async () => {
        await onDelete(v.id)
        setDeletingId(null)
    }, 420)
}

    return (
        <div className="flex-1 overflow-hidden rounded-xl shadow-sm border border-gray-100 bg-white">

        {/* Encabezado de la tabla con color primario de la marca */}
        <div className="grid grid-cols-[1fr_1fr_1fr_80px] bg-[#C6007E] text-white text-xs font-bold uppercase tracking-wider">
            <div className="px-4 py-3">Marca</div>
            <div className="px-4 py-3">Sucursal</div>
            <div className="px-4 py-3">Aspirante</div>
            <div className="px-4 py-3 text-center">Acc.</div>
        </div>

        {/* Filas con scroll vertical */}
        <div className="overflow-y-auto" style={{ maxHeight: '420px' }}>
            <AnimatePresence>
            {vehicles.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                No hay vehículos registrados.
                </div>
            ) : (
                vehicles.map((v, i) => (
                <motion.div
                    key={v.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                    deletingId === v.id
                        ? { opacity: 0, x: 60, scaleY: 0 }  // Animación de eliminación
                        : { opacity: 1, x: 0, scaleY: 1 }   // Estado normal
                    }
                    exit={{ opacity: 0, x: 60, scaleY: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className={`grid grid-cols-[1fr_1fr_1fr_80px] border-b border-gray-100 hover:bg-pink-50 transition-colors ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50'  // Filas alternadas
                }`}
            >
                <div className="px-4 py-2.5 text-sm text-gray-700 font-medium">{v.brand}</div>
                <div className="px-4 py-2.5 text-sm text-gray-500">{v.locality}</div>
                <div className="px-4 py-2.5 text-sm text-gray-500">{v.applicant}</div>
                <div className="px-4 py-2.5 flex items-center justify-center gap-2">
                  {/* Acciones solo visibles para administradores */}
                    {isAdmin && (
                    <>
                        <button
                            onClick={() => onEdit(v)}
                            className="text-gray-400 hover:text-[#00249C] transition-colors"
                            title="Editar vehículo"
                        >
                            <Pencil size={14} />
                        </button>
                        <button
                            onClick={() => handleDelete(v)}
                            className="text-gray-400 hover:text-[#C6007E] transition-colors"
                            title="Eliminar vehículo"
                            disabled={deletingId === v.id}
                        >
                            <Trash2 size={14} />
                        </button>
                    </>
                    )}
                </div>
                </motion.div>
                ))
            )}
        </AnimatePresence>
        </div>
    </div>
    )
}