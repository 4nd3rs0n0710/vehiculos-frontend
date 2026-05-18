'use client'

/**
 * Página de registro de usuario.
 * SRP: solo renderiza la UI.
 * Toda la lógica está en useSignupForm.
 */

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { useSignupForm, SIGNUP_CONSTRAINTS, SIGNUP_MESSAGES } from '@/lib/useSignupForm'

function SignupForm() {
  const router = useRouter()
  const {
    firstName, lastName, email, password, confirm,
    showPass, showConf, loading, error, success,
    setFirstName, setLastName, setEmail, setPassword, setConfirm,
    setShowPass, setShowConf,
    handleSubmit, handleOnlyLetters,
  } = useSignupForm()

  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms]     = useState(false)

  const inputLineStyle = "w-full h-[48px] px-5 rounded-full border border-[#E5E5E5] bg-transparent text-[14px] text-[#40CEE4] font-medium placeholder:text-[#40CEE4] placeholder:opacity-90 focus:outline-none focus:border-[#40CEE4] transition-all appearance-none"

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

      <div className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url('/login-bg.jpeg')` }} />
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(226,128,190,0.55) 100%)' }} />

      <div className="absolute top-9 left-14 z-10">
        <Image src="/Imagologo_motion.svg" alt="Motion" width={36} height={36}
          className="object-contain" style={{ width: '55px', height: 'auto' }} />
      </div>

      <motion.div
        className="relative z-10 bg-[#FCFCFC] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.10)] w-full mx-4 flex flex-col"
        style={{ maxWidth: '560px', padding: '50px 40px 30px 40px', minHeight: '700px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo + Manager */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <Image src="/Imagologo_motion.svg" alt="Motion Logo" width={64} height={64}
            className="object-contain flex-shrink-0" style={{ width: '90px', height: 'auto' }} />
          <div className="flex-shrink-0"
            style={{ width: '1px', height: '80px', backgroundColor: 'rgba(0,36,156,0.45)' }} />
          <span className="text-[34px] font-bold"
            style={{ fontFamily: 'var(--font-montserrat)', color: '#00249C', letterSpacing: '0.01em', paddingLeft: '6px' }}>
            Manager
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1" style={{ marginTop: '50px' }}>

          {/* Nombre + Apellido */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-[12px] font-semibold uppercase mb-3 tracking-wide"
                style={{ fontFamily: 'var(--font-montserrat)', color: '#00249C', paddingLeft: '20px' }}>
                Nombre <span style={{ color: '#C6007E' }}>*</span>
              </label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                onKeyDown={handleOnlyLetters}
                placeholder="NOMBRE" required maxLength={SIGNUP_CONSTRAINTS.MAX_NAME_LENGTH}
                style={{ fontFamily: 'var(--font-montserrat)', boxSizing: 'border-box', lineHeight: '48px' }}
                className={inputLineStyle} />
            </div>
            <span className="text-[#40CEE4] text-xl mb-3 flex-shrink-0">+</span>
            <div className="flex-1">
              <label className="block text-[12px] font-semibold uppercase mb-3 tracking-wide"
                style={{ fontFamily: 'var(--font-montserrat)', color: '#00249C', paddingLeft: '20px' }}>
                Apellido <span style={{ color: '#C6007E' }}>*</span>
              </label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                onKeyDown={handleOnlyLetters}
                placeholder="APELLIDO" required maxLength={SIGNUP_CONSTRAINTS.MAX_NAME_LENGTH}
                style={{ fontFamily: 'var(--font-montserrat)', boxSizing: 'border-box', lineHeight: '48px' }}
                className={inputLineStyle} />
            </div>
          </div>

          {/* Correo */}
          <div>
            <label className="block text-[12px] font-semibold uppercase mb-3 tracking-wide"
              style={{ fontFamily: 'var(--font-montserrat)', color: '#00249C', paddingLeft: '20px' }}>
              Correo <span style={{ color: '#C6007E' }}>*</span>
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="design@monitoringinnovation.com" required maxLength={SIGNUP_CONSTRAINTS.MAX_EMAIL_LENGTH}
              style={{ fontFamily: 'var(--font-montserrat)', boxSizing: 'border-box', lineHeight: '48px' }}
              className={inputLineStyle} />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-[12px] font-semibold uppercase mb-3 tracking-wide"
              style={{ fontFamily: 'var(--font-montserrat)', color: '#00249C', paddingLeft: '20px' }}>
              Contraseña <span style={{ color: '#C6007E' }}>*</span>
            </label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••••••••" required
                maxLength={SIGNUP_CONSTRAINTS.MAX_PASSWORD_LENGTH}
                style={{ fontFamily: 'var(--font-montserrat)', boxSizing: 'border-box', lineHeight: '48px' }}
                className={inputLineStyle} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8B8B8] hover:text-[#40CEE4] transition-colors">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-[12px] font-semibold uppercase mb-3 tracking-wide"
              style={{ fontFamily: 'var(--font-montserrat)', color: '#00249C', paddingLeft: '20px' }}>
              Confirmar contraseña <span style={{ color: '#C6007E' }}>*</span>
            </label>
            <div className="relative">
              <input type={showConf ? 'text' : 'password'} value={confirm}
                onChange={e => setConfirm(e.target.value)} placeholder="••••••••••••••" required
                maxLength={SIGNUP_CONSTRAINTS.MAX_PASSWORD_LENGTH}
                style={{ fontFamily: 'var(--font-montserrat)', boxSizing: 'border-box', lineHeight: '48px' }}
                className={inputLineStyle} />
              <button type="button" onClick={() => setShowConf(!showConf)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8B8B8] hover:text-[#40CEE4] transition-colors">
                {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error / Éxito */}
          <AnimatePresence>
            {error && (
              <motion.p className="text-xs text-center text-[#D10087]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p className="text-xs text-center text-green-600"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {SIGNUP_MESSAGES.SUCCESS}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Políticas + Botones */}
          <div className="flex flex-col gap-6" style={{ marginTop: '32px' }}>
            <p className="text-center text-[11px] text-gray-400 px-4"
              style={{ fontFamily: 'var(--font-montserrat)' }}>
              Al hacer clic en crear cuenta, acepta los términos de las{' '}
              <a href="#" onClick={e => { e.preventDefault(); setShowPrivacy(true) }}
                className="text-[#40CEE4] hover:opacity-80">políticas de privacidad</a>{' '}
              y{' '}
              <a href="#" onClick={e => { e.preventDefault(); setShowTerms(true) }}
                className="text-[#40CEE4] hover:opacity-80">términos del servicio</a>
            </p>

            <div className="flex justify-start items-center gap-7">
              <motion.button type="button" onClick={() => router.push('/login')}
                style={{ marginLeft: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}
                className="h-[44px] w-[140px] rounded-full bg-[#C6007E] text-white text-sm font-semibold hover:opacity-90 transition-all"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                ← Volver
              </motion.button>
              <motion.button type="submit" disabled={loading}
                className="h-[44px] w-[140px] rounded-full border border-[#40CEE4] bg-[#FCFCFC] text-[#40CEE4] text-sm font-medium shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:bg-[#40CEE4] hover:text-white transition-all disabled:opacity-60"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {loading ? 'Creando...' : 'Registrar'}
              </motion.button>
            </div>
          </div>

        </form>

        {/* Modal Políticas de Privacidad */}
        <AnimatePresence>
          {showPrivacy && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowPrivacy(false)} />
              <motion.div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
                <div className="px-10 pt-10 pb-6"
                  style={{ background: 'linear-gradient(135deg, rgba(64,206,228,0.12) 0%, rgba(0,36,156,0.06) 100%)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #40CEE4, #00249C)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#00249C]"
                        style={{ fontFamily: 'var(--font-montserrat)' }}>Políticas de Privacidad</h2>
                      <p className="text-xs text-[#40CEE4] font-medium mt-0.5"
                        style={{ fontFamily: 'var(--font-montserrat)' }}>Monitoring Innovation Manager</p>
                    </div>
                  </div>
                </div>
                <div className="h-[2px] mx-10" style={{ background: 'linear-gradient(to right, #40CEE4, transparent)' }} />
                <div className="overflow-y-auto px-10 py-8 flex-1 space-y-6">
                  {[
                    { title: '1. Recopilación de datos', text: 'Monitoring Innovation recopila únicamente los datos necesarios: nombre, apellido, correo electrónico y contraseña encriptada con PBKDF2-SHA256.' },
                    { title: '2. Uso de datos', text: 'Los datos se utilizan exclusivamente para autenticación y gestión de vehículos. No se comparten con terceros bajo ninguna circunstancia.' },
                    { title: '3. Seguridad', text: 'Las contraseñas se almacenan encriptadas. Los tokens tienen expiración automática y el sistema cuenta con protección contra ataques de fuerza bruta.' },
                    { title: '4. Derechos del usuario', text: 'El usuario puede solicitar la eliminación de su cuenta en cualquier momento contactando al administrador.' },
                    { title: '5. Contacto', text: 'Para consultas sobre privacidad: aplicativosoftware39@gmail.com' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#40CEE4' }} />
                      <div>
                        <p className="text-sm font-bold text-[#00249C] mb-1.5" style={{ fontFamily: 'var(--font-montserrat)' }}>{item.title}</p>
                        <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-montserrat)', color: '#C5C5C5' }}>{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-10 pb-10 pt-6 flex justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(64,206,228,0.05) 0%, rgba(0,36,156,0.03) 100%)' }}>
                  <button onClick={() => setShowPrivacy(false)}
                    className="h-[46px] w-[150px] rounded-full text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #40CEE4, #00249C)' }}>
                    Entendido
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Términos del Servicio */}
        <AnimatePresence>
          {showTerms && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowTerms(false)} />
              <motion.div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
                <div className="px-10 pt-10 pb-6"
                  style={{ background: 'linear-gradient(135deg, rgba(198,0,126,0.08) 0%, rgba(0,36,156,0.06) 100%)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #C6007E, #E280BE)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#00249C]"
                        style={{ fontFamily: 'var(--font-montserrat)' }}>Términos del Servicio</h2>
                      <p className="text-xs font-medium mt-0.5"
                        style={{ fontFamily: 'var(--font-montserrat)', color: '#C6007E' }}>Monitoring Innovation Manager</p>
                    </div>
                  </div>
                </div>
                <div className="h-[2px] mx-10" style={{ background: 'linear-gradient(to right, #C6007E, transparent)' }} />
                <div className="overflow-y-auto px-10 py-8 flex-1 space-y-6">
                  {[
                    { title: '1. Aceptación', text: 'Al registrarse en Monitoring Innovation Manager, el usuario acepta estos términos en su totalidad y se compromete a cumplirlos.' },
                    { title: '2. Uso del servicio', text: 'El servicio está destinado exclusivamente para la gestión de vehículos. El uso indebido puede resultar en la suspensión inmediata de la cuenta.' },
                    { title: '3. Responsabilidades', text: 'El usuario es responsable de mantener la confidencialidad de sus credenciales y de todas las actividades realizadas bajo su cuenta.' },
                    { title: '4. Roles y permisos', text: 'Los usuarios con rol "viewer" solo pueden consultar. Los usuarios con rol "admin" pueden crear, editar y eliminar registros.' },
                    { title: '5. Modificaciones', text: 'Monitoring Innovation se reserva el derecho de modificar estos términos en cualquier momento, notificando a los usuarios registrados.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#E280BE' }} />
                      <div>
                        <p className="text-sm font-bold text-[#00249C] mb-1.5" style={{ fontFamily: 'var(--font-montserrat)' }}>{item.title}</p>
                        <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-montserrat)', color: '#C5C5C5' }}>{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-10 pb-10 pt-6 flex justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(198,0,126,0.05) 0%, rgba(0,36,156,0.03) 100%)' }}>
                  <button onClick={() => setShowTerms(false)}
                    className="h-[46px] w-[150px] rounded-full text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #C6007E, #E280BE)' }}>
                    Entendido
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}