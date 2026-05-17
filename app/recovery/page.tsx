'use client'

/**
 * Página de recuperación de contraseña.
 * 
 * Responsabilidad única (SRP): solicita el email para enviar
 * el correo de recuperación.
 */

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import api from '@/lib/axios'

/** Constraints de validación del formulario */
const RECOVERY_CONSTRAINTS = {
    MAX_EMAIL_LENGTH: 50,
} as const

/** Mensajes del formulario */
const RECOVERY_MESSAGES = {
    SUCCESS: 'Si el correo existe, recibirás un enlace de recuperación.',
    ERROR: 'Ocurrió un error. Intenta nuevamente.',
} as const

function RecoveryForm() {
    const router = useRouter()
    const [email, setEmail]     = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        if (!message) return
        const timer = setTimeout(() => setMessage(''), 5000)
        return () => clearTimeout(timer)
    }, [message])

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            await api.post('/auth/recovery/', { email })
            setMessage(RECOVERY_MESSAGES.SUCCESS)
            setIsError(false)
            setEmail('')
        } catch {
            setMessage(RECOVERY_MESSAGES.ERROR)
            setIsError(true)
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
            background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(64,206,228,0.9) 100%)',
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

      {/* Card de recuperación */}
        <motion.div
            className="relative z-10 bg-[#FCFCFC] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.10)] w-full mx-4 flex flex-col"
            style={{ maxWidth: '560px', padding: '63px 40px', minHeight: '730px', position: 'relative'}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
        {/* Logo + separador + Manager */}
        <div className="flex items-center justify-center gap-4 mb-10">
            <Image
                src="/Imagologo_motion.svg"
                alt="Motion Logo"
                width={64}
                height={64}
                className="object-contain flex-shrink-0"
                style={{ width: '100px', height: 'auto' }}
            />
        <div
            className="flex-shrink-0"
            style={{ width: '1px', height: '100px', backgroundColor: 'rgba(0,36,156,0.45)' }}
        />
        <span
            className="text-[34px] font-bold"
            style={{ fontFamily: 'var(--font-montserrat)', color: '#00249C', letterSpacing: '0.01em', paddingLeft: '6px' }}
            >
            Manager
            </span>
        </div>

        {/* Texto descriptivo */}
        <p
            className="text-center text-sm text-gray-500 px-16"
            style={{ fontFamily: 'var(--font-montserrat)', marginTop: '8rem', lineHeight: '1.6' }}
        >
            Digite el correo electrónico con el que se registró la cuenta:
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 mt-10 flex-grow">


          {/* Campo email */}
        <div>
            <label
                className="block text-[13px] font-semibold uppercase mb-2 tracking-wide"
                style={{ fontFamily: 'var(--font-montserrat)', color: '#00249C', paddingLeft: '20px' }}
            >
                Email
            </label>
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
                maxLength={RECOVERY_CONSTRAINTS.MAX_EMAIL_LENGTH}
                style={{ fontFamily: 'var(--font-montserrat)', lineHeight: '48px', boxSizing: 'border-box' }}
                className="w-full h-[48px] px-5 rounded-full border border-[#E5E5E5] bg-transparent text-[15px] text-[#40CEE4] font-medium placeholder:text-[#40CEE4] placeholder:font-medium placeholder:opacity-90 focus:outline-none focus:border-[#40CEE4] transition-all appearance-none"
            />
            </div>

          {/* Mensaje de respuesta */}
            <AnimatePresence>
            {message && (
                <motion.p
                    className={`text-xs text-center ${isError ? 'text-[#D10087]' : 'text-green-600'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                {message}
                </motion.p>
            )}
            </AnimatePresence>

          {/* Botón enviar */}
            <div className="flex justify-center">
            <motion.button
                type="submit"
                disabled={loading}
                className="h-[35px] min-w-[115px] px-14 rounded-full border border-[#40CEE4] bg-[#FCFCFC] text-[#40CEE4] text-[15px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:bg-[#40CEE4] hover:text-white transition-all disabled:opacity-60"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                {loading ? 'Enviando...' : 'Enviar correo'}
            </motion.button>
            </div>
        </form>

        {/* Botón volver */}
        <div className="mt-auto pb-4 flex justify-start">
            <motion.button
                onClick={() => router.push('/login')}
                style={{ marginLeft: '24px', boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}
                className="h-[38px] w-[100px] rounded-full bg-[#C6007E] text-white text-[14px] font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                ← Volver
            </motion.button>
        </div>
        </motion.div>
    </div>
    )
}

export default function RecoveryPage() {
    return (
    <Suspense>
        <RecoveryForm />
    </Suspense>
    )
}