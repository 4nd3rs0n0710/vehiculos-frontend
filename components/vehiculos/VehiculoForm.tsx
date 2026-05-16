'use client'

/**
 * Formulario reutilizable para crear y editar vehículos.
 * 
 * Recibe `initial` para modo edición (campos precargados)
 * o null/undefined para modo creación (campos vacíos).
 * 
 * Llama a `onSave` con los datos del formulario y
 * `onCancel` para cerrar sin guardar.
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import type { Vehicle, VehicleFormData } from '@/types'

interface Props {
    initial?:  Vehicle | null  // Si existe, activa modo edición
    onSave:    (data: VehicleFormData) => Promise<void>
    onCancel:  () => void
}

export default function ViculoForm({ initial, onSave, onCancel }: Props) {
    const [form, setForm]       = useState<VehicleFormData>({ brand: '', locality: '', applicant: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState('')

    // Precarga los datos cuando se abre en modo edición
    useEffect(() => {
        if (initial) {
            setForm({ brand: initial.brand, locality: initial.locality, applicant: initial.applicant })
        } else {
        setForm({ brand: '', locality: '', applicant: '' })
    }
    }, [initial])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
        await onSave(form)
        } catch {
        setError('Error al guardar. Verifica los datos.')
        } finally {
        setLoading(false)
    }
}

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#40CEE4] bg-white transition-colors"

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
        >
        <input
            className={inputClass}
            placeholder="Marca"
            value={form.brand}
            onChange={e => setForm({ ...form, brand: e.target.value })}
            required
        />
        <input
            className={inputClass}
            placeholder="Localidad / Sucursal"
            value={form.locality}
            onChange={e => setForm({ ...form, locality: e.target.value })}
            required
        />
        <input
            className={inputClass}
            placeholder="Aspirante"
            value={form.applicant}
            onChange={e => setForm({ ...form, applicant: e.target.value })}
            required
        />

        {/* Mensaje de error de la API */}
        {error && <p className="text-[#C6007E] text-xs">{error}</p>}

        {/* Botones de confirmar y cancelar — diseño del Figma */}
        <div className="flex gap-2 pt-1">
            <motion.button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#40CEE4] text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 disabled:opacity-60"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            <Check size={15} />
            {loading ? 'Guardando...' : (initial ? 'Actualizar' : 'Crear')}
        </motion.button>
        <motion.button
            type="button"
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-1 py-2 border border-[#C6007E] text-[#C6007E] rounded-lg text-sm font-semibold hover:bg-red-50"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            <X size={15} />
            Cancelar
        </motion.button>
        </div>
    </motion.form>
    )
}