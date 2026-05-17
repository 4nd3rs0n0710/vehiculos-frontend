'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Car, MapPin, User, Plus } from 'lucide-react'
import type { Vehicle, VehicleFormData } from '@/types'
import ViculoForm from './VehiculoForm'

interface Props {
  vehicles:       Vehicle[]
  isAdmin:        boolean
  editTarget:     Vehicle | null
  showCreate:     boolean
  onCreateToggle: () => void
  onEditCancel:   () => void
  onSaveCreate:   (data: VehicleFormData) => Promise<void>
  onSaveEdit:     (data: VehicleFormData) => Promise<void>
}

export default function FilterCards({
  vehicles, isAdmin, editTarget, showCreate,
  onCreateToggle, onEditCancel, onSaveCreate, onSaveEdit,
}: Props) {
  const brands     = [...new Set(vehicles.map(v => v.brand))].slice(0, 1)
  const localities = [...new Set(vehicles.map(v => v.locality))].slice(0, 1)
  const applicants = [...new Set(vehicles.map(v => v.applicant))].slice(0, 1)

  const showForm = showCreate || !!editTarget

  return (
    <div className="w-64 flex-shrink-0 flex flex-col gap-3">

      {/* Botón nuevo vehículo */}
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

      {/* Formulario */}
      <AnimatePresence mode="wait">
        {showForm && (
          <ViculoForm
            key={editTarget?.id ?? 'create'}
            initial={editTarget}
            onSave={editTarget ? onSaveEdit : onSaveCreate}
            onCancel={editTarget ? onEditCancel : onCreateToggle}
          />
        )}
      </AnimatePresence>

      {/* Cards — píldoras redondeadas como el mockup */}
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

function InfoCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.div
      className="flex items-center gap-3 px-5 py-3 bg-white rounded-full border border-gray-200 shadow-sm cursor-default"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
    >
      <span className="text-gray-400">{icon}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </motion.div>
  )
}