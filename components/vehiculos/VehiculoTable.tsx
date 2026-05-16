'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import type { Vehicle } from '@/types'

interface Props {
    vehicles: Vehicle[]
    isAdmin: boolean
    onEdit:   (v: Vehicle) => void
    onDelete: (id: number) => Promise<void>
}

export default function ViculoTable({ vehicles, isAdmin, onEdit, onDelete }: Props) {
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const handleDelete = async (v: Vehicle) => {
        if (!confirm(`¿Eliminar "${v.brand}"?`)) return
        setDeletingId(v.id)
        setTimeout(async () => {
        await onDelete(v.id)
        setDeletingId(null)
        }, 420)
    }

    return (
        <div className="flex-1 overflow-hidden rounded-xl shadow-sm border border-gray-100 bg-white">
        <div className="grid grid-cols-[1fr_1fr_1fr_80px] bg-[#C6007E] text-white text-xs font-bold uppercase tracking-wider">
            <div className="px-4 py-3">Marca</div>
            <div className="px-4 py-3">Sucursal</div>
            <div className="px-4 py-3">Aspirante</div>
            <div className="px-4 py-3 text-center">Acc.</div>
        </div>

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
                        ? { opacity: 0, x: 60, scaleY: 0 }
                        : { opacity: 1, x: 0, scaleY: 1 }
                    }
                    exit={{ opacity: 0, x: 60, scaleY: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className={`grid grid-cols-[1fr_1fr_1fr_80px] border-b border-gray-100 hover:bg-pink-50 transition-colors ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                >
                    <div className="px-4 py-2.5 text-sm text-gray-700 font-medium">{v.brand}</div>
                    <div className="px-4 py-2.5 text-sm text-gray-500">{v.locality}</div>
                    <div className="px-4 py-2.5 text-sm text-gray-500">{v.applicant}</div>
                    <div className="px-4 py-2.5 flex items-center justify-center gap-2">
                    {isAdmin && (
                        <>
                        <button
                            onClick={() => onEdit(v)}
                            className="text-gray-400 hover:text-[#00249C] transition-colors"
                        >
                            <Pencil size={14} />
                        </button>
                        <button
                            onClick={() => handleDelete(v)}
                            className="text-gray-400 hover:text-[#C6007E] transition-colors"
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