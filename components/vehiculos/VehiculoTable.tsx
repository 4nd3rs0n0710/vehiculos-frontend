'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Vehicle } from '@/types'
import Image from 'next/image'

interface Props {
  vehicles: Vehicle[]
  isAdmin:  boolean
  onEdit:   (vehicle: Vehicle) => void
  onDelete: (id: number) => void
  selectedVehicleId: number | null
}

function EditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10.5" stroke="#40CEE4" strokeWidth="1"/>
      <path d="M13.5 7.5l1 1-5.5 5.5-1.5.5.5-1.5 5.5-5.5z" fill="#40CEE4" fillOpacity="0.15" stroke="#40CEE4" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10.5" stroke="#C6007E" strokeWidth="1"/>
      <line x1="7" y1="11" x2="15" y2="11" stroke="#C6007E" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export default function VehiculoTable({ vehicles, isAdmin, onEdit, onDelete, selectedVehicleId }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmId, setConfirmId]   = useState<number | null>(null)

  const handleDelete = (id: number) => setConfirmId(id)

  const confirmDelete = () => {
    if (!confirmId) return
    setDeletingId(confirmId)
    setConfirmId(null)
    setTimeout(() => {
      onDelete(confirmId)
      setDeletingId(null)
    }, 400)
  }

  return (
    <>
      {/* Modal confirmación */}
      <AnimatePresence>
        {confirmId && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setConfirmId(null)} />
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6 z-10"
              style={{ maxWidth: '420px', width: '90%' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-[#C6007E]/10 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C6007E" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-base font-semibold text-gray-700">Eliminar vehículo</p>
                <p className="text-center text-gray-400 text-sm" style={{ fontFamily: 'var(--font-montserrat)' }}>
                  ¿Estás seguro que quieres eliminar este vehículo? Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex gap-4" style={{ marginBottom: '16px' }}>
                <button onClick={() => setConfirmId(null)}
                  className="py-3 rounded-xl border border-[#C5C5C5] text-gray-400 text-sm font-medium hover:bg-gray-50 transition-all"
                  style={{ padding: '10px 32px' }}>
                  Cancelar
                </button>
                <button onClick={confirmDelete}
                  className="py-3 rounded-xl bg-[#C6007E] text-white text-sm font-medium hover:opacity-90 transition-all"
                  style={{ padding: '10px 40px' }}>
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabla */}
      <div style={{ width: '580px' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th className="bg-[#C6007E] text-white text-sm font-semibold uppercase tracking-wide py-5 px-4 text-center"
                style={{ fontFamily: 'var(--font-montserrat)', width: '150px', height: '30px'}}>
                Marca
              </th>
              <th style={{ width: '6px', background: 'white' }} />
              <th className="bg-[#C6007E] text-white text-sm font-semibold uppercase tracking-wide py-5 px-4 text-center"
                style={{ fontFamily: 'var(--font-montserrat)', width: '160px', height: '30px' }}>
                Sucursal
              </th>
              <th style={{ width: '6px', background: 'white' }} />
              <th className="bg-[#C6007E] text-white text-sm font-semibold uppercase tracking-wide py-5 px-4 text-center"
                style={{ fontFamily: 'var(--font-montserrat)', width: '258px', height: '30px' }}>
                Aspirante
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400 text-xs"
                  style={{ fontFamily: 'var(--font-montserrat)' }}>
                  No hay vehículos registrados
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <motion.tr
                  key={vehicle.id}
                  style={{ borderBottom: '1px solid #E280BE', height: '20px' }}
                  className={`transition-all hover:bg-pink-50 ${
                    deletingId === vehicle.id
                      ? 'opacity-0 scale-95'
                      : selectedVehicleId !== null && selectedVehicleId !== vehicle.id
                        ? 'opacity-50'
                        : 'opacity-100'
                  }`}
                >
                  <td className="py-2.5 px-4 text-xs text-gray-600 text-left"
                    style={{ fontFamily: 'var(--font-montserrat)' }}>
                    {vehicle.brand}
                  </td>
                  <td style={{ width: '6px' }} />
                  <td className="py-2.5 px-4 text-xs text-gray-500 text-left"
                    style={{ fontFamily: 'var(--font-montserrat)' }}>
                    {vehicle.locality}
                  </td>
                  <td style={{ width: '6px' }} />
                  <td className="py-2.5 px-4 text-xs text-gray-500 text-left"
                    style={{ fontFamily: 'var(--font-montserrat)' }}>
                    <div className="flex items-center justify-between gap-2">
                      <span>{vehicle.applicant}</span>
                      {isAdmin && (
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button onClick={() => onEdit(vehicle)}
                            className="hover:opacity-70 transition-all w-[22px] h-[22px] flex items-center justify-center" aria-label="Editar">
                            <Image src="/Icon_editar1.svg" alt="Editar" width={16} height={16} style={{ height: 'auto' }} />
                          </button>
                          <button onClick={() => handleDelete(vehicle.id)}
                            className="hover:opacity-70 transition-all w-[22px] h-[22px] flex items-center justify-center" aria-label="Eliminar">
                            <Image src="/Icon_eliminar1.svg" alt="Eliminar" width={16} height={16} style={{ height: 'auto' }} />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}