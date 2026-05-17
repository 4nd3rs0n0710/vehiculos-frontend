'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, HelpCircle, UserCircle } from 'lucide-react'
import Image from 'next/image'
import { login } from '@/lib/api'
import { saveTokens, isAuthenticated } from '@/lib/auth'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const expired      = searchParams.get('expired')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showExpired, setShowExpired] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) router.replace('/dashboard')
  }, [router])

  useEffect(() => {
  if (error) {
    const timer = setTimeout(() => setError(''), 5000)
    return () => clearTimeout(timer)
  }
}, [error])

useEffect(() => {
  if (showExpired) {
    const timer = setTimeout(() => {
      setShowExpired(false)
      router.replace('/login')
    }, 5000)
    return () => clearTimeout(timer)
  }
}, [showExpired, router])

useEffect(() => {
  if (expired) setShowExpired(true)
}, [expired])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const tokens = await login(username, password)
      saveTokens(tokens)
      router.push('/dashboard')
      } catch {
        setError('Usuario o contraseña incorrectos.')
        setUsername('')
        setPassword('')
      } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

      {/* Fondo con imagen de carros */}
      <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url('/login-bg.jpeg')` }}
      />

      {/* Overlay gradiente */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(64,206,228,0.4) 0%, rgba(198,0,126,0.3) 100%)',
        }}
      />

      {/* Logo top-left */}
      <div className="absolute top-9 left-14 z-10">
        <Image
          src="/Imagologo_motion.svg"
          alt="Motion"
          width={36}
          height={36}
          className="object-contain"
          style={{ width: '55px', height: 'auto' }}
        />
      </div>

      {/* Card de login — misma altura y ancho */}
      <motion.div
        className="relative z-10 bg-[#FCFCFC] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.10)] w-full mx-4 flex flex-col justify-between"
        style={{ maxWidth: '560px', padding: '63px 40px', minHeight: '750px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >

        {/* Logo + separador + Manager — CENTRADO */}
        <div className="flex items-center justify-center gap-4 mt-2 mb-0">
          <Image
            src="/Imagologo_motion.svg"
            alt="Motion Logo"
            width={64}
            height={64}
            className="object-contain flex-shrink-0"
            style={{ width: '110px', height: 'auto' }}
          />
          <div
            className="flex-shrink-0"
            style={{
              width: '1px',
              height: '100px',
              backgroundColor: 'rgba(0,36,156,0.45)',
            }}
          />
          <span
            className="text-[34px] font-bold"
            style={{
              fontFamily: 'var(--font-montserrat)',
              color: '#00249C',
              letterSpacing: '0.01em',
              paddingLeft: '6px',
            }}
          >
            Manager
          </span>
        </div>

        

        <form onSubmit={handleSubmit} className="flex flex-col gap-12 mt-32">

          {/* Sesión expirada */}
        {showExpired && (
          <AnimatePresence>
            <motion.div
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              Tu sesión ha expirado. Por favor inicia sesión nuevamente.
            </motion.div>
          </AnimatePresence>
        )}

          {/* Campo usuario */}
          <div>
            <label
              className="block text-[13px] font-semibold uppercase mb-2 tracking-wide pl-2"
              style={{ fontFamily: 'var(--font-montserrat)', color: '#00249C', paddingLeft: '20px' }}
            >
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="design@monitoringinnovation.com"
              required
              style={{
                fontFamily: 'var(--font-montserrat)',
                lineHeight: '48px',    /* igual a la altura del input */
                boxSizing: 'border-box',
              }}
              className="
                w-full
                h-[48px]
                px-5
                rounded-full
                border
                border-[#E5E5E5]
                bg-transparent

                text-[15px]
                text-[#40CEE4]
                font-medium

                placeholder:text-[#40CEE4]
                placeholder:font-medium
                placeholder:opacity-90

                focus:outline-none
                focus:border-[#40CEE4]
                transition-all

                appearance-none
              "
            />
          </div>

          {/* Campo contraseña */}
          <div>
            <label
              className="block text-[13px] font-semibold uppercase mb-2 tracking-wide pl-2"
              style={{ fontFamily: 'var(--font-montserrat)', color: '#00249C', paddingLeft: '20px' }}
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                required
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  lineHeight: '48px',    /* igual a la altura del input */
                  boxSizing: 'border-box',
                }}
                className="
                  w-full
                  h-[48px]
                  pl-5
                  pr-12
                  rounded-full
                  border
                  border-[#E5E5E5]
                  bg-transparent

                  text-[15px]
                  text-[#40CEE4]
                  font-medium

                  placeholder:text-[#40CEE4]
                  placeholder:font-medium
                  placeholder:opacity-90



                  focus:outline-none
                  focus:border-[#40CEE4]
                  transition-all

                  appearance-none
                "
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-[#B8B8B8]
                  hover:text-[#40CEE4]
                  transition-colors
                  "
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-[#D10087] text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Botón */}
          <div className="flex justify-center mt-6">
            <motion.button
            type="submit"
            disabled={loading}
            className="
              h-[35px]
              min-w-[115px]
              px-14
              rounded-full
              border
              border-[#40CEE4]
              bg-[#FCFCFC]
              text-[#40CEE4]
              text-[15px]
              font-medium
              shadow-[0_4px_12px_rgba(0,0,0,0.10)]
              hover:bg-[#40CEE4]
              hover:text-white
              transition-all
              disabled:opacity-60
            "
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
          {loading ? 'Iniciando...' : 'Iniciar sesión'}
        </motion.button>
          </div>
        </form>

        {/* Links */}
        <div className="mt-12 flex justify-center gap-40 text-[14px] font-semibold">
          <a href="#" className="text-[#D10087] hover:opacity-80 transition-opacity">
            Olvidé <span className="font-bold">Mi</span> contraseña
          </a>
          <a href="#" className="text-[#D10087] hover:opacity-80 transition-opacity font-bold">
            Registrarse
          </a>
        </div>

        {/* Iconos inferiores */}
        <div className="mt-auto pt-10 flex justify-center gap-6">
          <div className="
              w-[64px]
              h-[64px]
              rounded-2xl
              bg-[#FCFCFC]
              shadow-[0_2px_8px_rgba(0,0,0,0.08)]
              flex items-center justify-center
              text-[#40CEE4]
              cursor-pointer
              hover:bg-[#40CEE4]/10
              transition-all
              border border-[#40CEE4]/20
              ">
            <HelpCircle size={28} strokeWidth={1.8} />
          </div>
          <div className="
            w-[64px]
            h-[64px]
            rounded-2xl
            bg-[#FCFCFC]
            shadow-[0_4px_12px_rgba(0,0,0,0.12)]
            flex items-center justify-center
            text-[#40CEE4]
            cursor-pointer
            hover:bg-[#40CEE4]/10
            transition-all
            border border-[#40CEE4]/20
            ">
            <UserCircle size={28} strokeWidth={1.8} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}