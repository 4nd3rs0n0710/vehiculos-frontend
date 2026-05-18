'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios'
import { isAuthenticated, isAdmin as checkAdmin} from '@/lib/auth'
import { getUsername, getRole, clearTokens } from '@/lib/auth'
import { Vehicle } from '@/types'
import VehiculoTable from '@/components/vehiculos/VehiculoTable'


export default function DashboardPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [brand, setBrand] = useState('');
  const [locality, setLocality] = useState('');
  const [applicant, setApplicant] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false)
  const [username, setUsername] = useState('Usuario')
  const role = getRole() ?? 'viewer'
  const [displayName, setDisplayName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [initials, setInitials] = useState('U')

  const showMessage = (type: 'error' | 'success', msg: string) => {
    if (type === 'error') setErrorMsg(msg);
    else setSuccessMsg(msg);
    setTimeout(() => { setErrorMsg(''); setSuccessMsg(''); }, 3000);
  };

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await api.get<Vehicle[]>('/vehicles/')
      setVehicles(res.data);
    } catch {
      showMessage('error', 'Error cargando vehículos. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    clearTokens()
    router.push('/login')
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    setUsername(getUsername() ?? 'Usuario')
    setIsAdmin(checkAdmin())
    api.get('/auth/profile/').then(res => {
      const { first_name, last_name, username } = res.data
      const fullName = first_name && last_name
        ? `${first_name} ${last_name}`
        : username
      setDisplayName(fullName)
      setInitials(fullName[0]?.toUpperCase() ?? 'U')
    }).catch(() => {
      const u = getUsername() ?? 'Usuario'
      setDisplayName(u)
      setInitials(u[0]?.toUpperCase() ?? 'U')
    })
    fetchVehicles()
  }, [router, fetchVehicles])

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.dropdown-container')) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setBrand(vehicle.brand);
    setLocality(vehicle.locality);
    setApplicant(vehicle.applicant);
    setIsOpen(true);
  };

  const handleCancel = () => {
    setSelectedVehicle(null);
    setBrand('');
    setLocality('');
    setApplicant('');
    setIsOpen(false);
  };

  const handleSave = async () => {
    if (!brand || !locality || !applicant) return;
    try {
      if (selectedVehicle) {
        await api.patch(`/vehicles/${selectedVehicle.id}/`, { brand, locality, applicant })
        showMessage('success', 'Vehículo actualizado correctamente.');
      } else {
        await api.post('/vehicles/', { brand, locality, applicant })
        showMessage('success', 'Vehículo creado correctamente.');
      }
      handleCancel();
      fetchVehicles();
    } catch {
      showMessage('error', 'Error guardando el vehículo. Intenta de nuevo.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/vehicles/${id}/`);
      showMessage('success', 'Vehículo eliminado correctamente.');
      fetchVehicles();
    } catch {
      showMessage('error', 'Error eliminando el vehículo. Intenta de nuevo.');
    }
  };



  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Toast */}
        <AnimatePresence>
          {(errorMsg || successMsg) && (
            <motion.div
              className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl text-white shadow-xl ${
                errorMsg ? 'bg-[#C6007E]' : 'bg-[#40CEE4]'
              }`}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                {errorMsg ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide opacity-80">
                  {errorMsg ? 'Error' : 'Éxito'}
                </p>
                <p className="text-sm font-medium">{errorMsg || successMsg}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Top-right user dropdown */}
      <div className="relative flex justify-end px-6 pt-4 dropdown-container">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 hover:opacity-80 transition-all"
        >
          <div
            className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #40CEE4, #00249C)' }}
          >
            {initials}
          </div>
          <span className="text-xs font-medium text-gray-600">{displayName || username}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              className="absolute top-12 right-6 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
              style={{ minWidth: '240px' }}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              {/* Header con gradiente */}
              <div className="px-5 py-5" style={{ background: 'linear-gradient(135deg, #40CEE4 0%, #00249C 100%)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{displayName || username}</p>
                    <p className="text-xs text-white/70 font-medium">
                      {role === 'admin' ? 'Administrador' : 'Visualizador'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Role badge */}
              <div className="px-5 py-3 flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: role === 'admin' ? '#40CEE4' : '#C5C5C5' }}
                />
                <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                  {role === 'admin' ? 'Acceso completo' : 'Solo lectura'}
                </span>
              </div>

              <div className="h-px mx-5 bg-gray-100" />

              {/* Logout */}
              <div className="px-5 py-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#C6007E]/10 flex items-center justify-center group-hover:bg-[#C6007E]/20 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C6007E" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-[#C6007E]">Cerrar sesión</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main content */}
      <main className="w-full flex-1 flex items-start py-10 px-20">
        <div className="flex gap-16" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', marginLeft: isAdmin ? '5%' : 'auto' }}>

        {/* Left panel — admin only */}
        {isAdmin && (
          <div className="shrink-0 flex flex-col bg-white rounded-2xl shadow-md p-8"
            style={{ width: '380px', alignSelf: 'flex-start', minHeight: '180px' }}>

            {/* + toggle */}
            <div
              className="flex items-center gap-2 cursor-pointer select-none mb-6"
              onClick={() => !isOpen && setIsOpen(true)}
            >
              <motion.span
                className="text-[#40CEE4] text-3xl font-light leading-none"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
              >
                +
              </motion.span>
            </div>

            {/* Form inputs */}
            <div className="flex flex-col gap-5 items-center">

              {/* Brand */}
              <div className="flex items-center gap-3">
                <Image src={isOpen ? "/Icon_vehiculo1.svg" : "/Icon_vehiculo.svg"} 
                  alt="Marca" width={28} height={28} style={{ width: '28px', height: '28px' }} className="shrink-0" />
                <input
                  type="text" value={brand} onChange={(e) => setBrand(e.target.value)}
                  placeholder="Mazda" maxLength={100} disabled={!isOpen}
                  className="w-64 border border-[#C5C5C5] rounded-full px-6 py-3.5 text-lg text-gray-400 bg-white outline-none focus:border-[#40CEE4] transition-all disabled:opacity-50"
                />
              </div>

              {/* Locality */}
              <div className="flex items-center gap-3">
                <Image src={isOpen ? "/Icon_puntoubicacion1.svg" : "/Icon_puntoubicacion.svg"} 
                  alt="Localidad" width={28} height={28} style={{ width: '28px', height: '28px' }} className="shrink-0" />
                <input
                  type="text" value={locality} onChange={(e) => setLocality(e.target.value)}
                  placeholder="Chapinero" maxLength={50} disabled={!isOpen}
                  className="w-64 min-w-0 border border-[#C5C5C5] rounded-full px-6 py-3.5 text-lg text-gray-400 bg-white outline-none focus:border-[#40CEE4] transition-all disabled:opacity-50"
                />
              </div>


              {/* Applicant */}
              <div className="flex items-center gap-3">
                <Image src={isOpen ? "/Icon_persona1.svg" : "/Icon_persona.svg"} 
                  alt="Aspirante" width={28} height={28} style={{ width: '28px', height: '28px' }} className="shrink-0" />
                <input
                  type="text" value={applicant} onChange={(e) => setApplicant(e.target.value)}
                  placeholder="David Sandoval" maxLength={100} disabled={!isOpen}
                  className="w-64 min-w-0 border border-[#C5C5C5] rounded-full px-6 py-3.5 text-lg text-gray-400 bg-white outline-none focus:border-[#40CEE4] transition-all disabled:opacity-50"
                />
              </div>

              {/* Action buttons */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {selectedVehicle ? (
                        <div className="flex justify-end gap-2 mt-4" style={{ marginBottom: '16px', marginRight: '44px' }}>
                          <button onClick={handleCancel} className="hover:opacity-70 transition-all">
                            <Image src="/Icon_cancelar.svg" alt="Cancelar" width={30} height={30} style={{ width: '30px', height: '30px' }} />
                          </button>
                          <button onClick={handleSave} className="hover:opacity-70 transition-all">
                            <Image src="/Icon_confirmar.svg" alt="Confirmar" width={30} height={30} style={{ width: '30px', height: '30px' }} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-8 mt-4" style={{ marginBottom: '16px' }}>
                          <button
                            onClick={handleCancel}
                            style={{ padding: '2px 12px' }}
                            className="border border-[#C6007E] text-gray-400 rounded-md text-base font-medium hover:bg-[#C6007E] hover:text-white transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSave}
                            style={{ padding: '2px 26px' }}
                            className="border border-[#40CEE4] text-gray-400 rounded-md text-base font-medium hover:bg-[#40CEE4] hover:text-white transition-all"
                          >
                            Crear
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

        {/* Table area */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <p className="text-center text-gray-400 py-10 text-sm">Cargando...</p>
          ) : (
            <VehiculoTable
              vehicles={vehicles}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
              selectedVehicleId={selectedVehicle?.id ?? null}
            />
          )}
        </div>
          </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-16 left-1/2 -translate-x-1/2">
        <a href="/home" className="hover:opacity-80 transition-all">
          <Image src="/Imagologotipo_motion.svg" alt="Motion" width={140} height={40} 
            loading="eager"
            style={{ width: '220px', height: '52px' }} />
        </a>
      </footer>

    </div>
  );
}