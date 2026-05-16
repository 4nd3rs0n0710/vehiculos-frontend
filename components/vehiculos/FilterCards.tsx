'use client'

/**
 * Panel izquierdo del dashboard.
 * 
 * Tiene dos estados:
 * 1. Cards de info: muestra marca, localidad y aspirante del primer vehículo
 * 2. Formulario: aparece al crear o editar, reemplazando las cards con animación
 * 
 * El botón "+" solo es visible para administradores.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { Car, MapPin, User, Plus } from 'lucide-react'
import type { Vehicle, VehicleFormData } from '@/types'
import ViculoForm from './VehiculoForm'

interface Props {
    vehicles:       Vehicle[]
    isAdmin:        boolean
    editTarget:     Vehicle | null   // Vehículo seleccionado para editar
    showCreate:     boolean          // Controla si se muestra el formulario de creación
    onCreateToggle: () => void
    onEditCancel:   () => void
    onSaveCreate:   (data: VehicleFormData) => Promise<void>
    onSaveEdit:     (data: VehicleFormData) => Promise<void>
}

export default function FilterCards({
    vehicles, isAdmin, editTarget, showCreate,
    onCreateToggle, onEditCancel, onSaveCreate, onSaveEdit,
}: Props) {
    // Extrae valores únicos para mostrar en las cards
    const brands     = [...new Set(vehicles.map(v => v.brand))].slice(0, 1)
    const localities = [...new Set(vehicles.map(v => v.locality))].slice(0, 1)
    const applicants = [...new Set(vehicles.map(v => v.applicant))].slice(0, 1)

    // El formulario reemplaza las cards cuando se crea o edita
    const showForm = showCreate || !!editTarget

    return (
        <div className="w-64 flex-shrink-0 flex flex-col gap-3">

        {/* Botón nuevo vehículo — solo para admins y cuando no hay formulario abierto */}
        {isAdmin && !showForm && (
            <motion.button
            onClick={onCreateToggle}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00249C] transition-colors font-medium"
            whileHover={{ x: 3 }}
        >
            <div className="w-7 h-7 rounded-full border-2 border-gray-300 hover:border-[#00249C] flex items-center justify-center transition-colors">
                <Plus size={14} />
            </div>
            Nuevo vehículo
        </motion.button>
        )}

      {/* Formulario de crear/editar con animación de entrada y salida */}
        <AnimatePresence mode="wait">
            {showForm && (
                <ViculoForm
                key={editTarget?.id ?? 'create'}  // Key distinta fuerza remontaje al cambiar de vehículo
                initial={editTarget}
                onSave={editTarget ? onSaveEdit : onSaveCreate}
                onCancel={editTarget ? onEditCancel : onCreateToggle}
            />
        )}
        </AnimatePresence>

      {/* Cards de información — visibles cuando no hay formulario */}
        <AnimatePresence>
        {!showForm && (
            <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
            <InfoCard icon={<Car size={18} />}    label={brands[0]     || 'Marca'}     />
            <InfoCard icon={<MapPin size={18} />} label={localities[0] || 'Localidad'} />
            <InfoCard icon={<User size={18} />}   label={applicants[0] || 'Aspirante'} />
            </motion.div>
        )}
        </AnimatePresence>
    </div>
    )
}

/**
 * Card individual de información.
 * Tiene animación de hover para mejorar la experiencia de usuario.
 */
function InfoCard({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <motion.div
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-default"
            whileHover={{ scale: 1.02, y: -1 }}
            transition={{ duration: 0.15 }}
        >
        <span className="text-gray-400">{icon}</span>
        <span className="text-sm text-gray-600 font-medium">{label}</span>
    </motion.div>
    )
}