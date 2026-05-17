'use client'

/**
 * Página de restablecimiento de contraseña.
 * SRP: solo maneja el formulario de nueva contraseña.
 */

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import api from '@/lib/axios'

/** Constraints de validación */
const RESET_CONSTRAINTS = {
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 20,
} as const

/** Mensajes centralizados */
const RESET_MESSAGES = {
    SUCCESS: 'Contraseña restablecida exitosamente. Redirigiendo al login...',
    ERROR: 'El enlace es inválido o ha expirado.',
    MISMATCH: 'Las contraseñas no coinciden.',
    TOO_SHORT: `La contraseña debe tener al menos ${RESET_CONSTRAINTS.MIN_PASSWORD_LENGTH} caracteres.`,
} as const

function ResetPasswordForm() {
    const router       = useRouter()
    const searchParams = useSearchParams()
    const uid          = searchParams.get('uid')
    const token        = searchParams.get('token')

    const [password, setPassword]     = useState('')
    const [confirm, setConfirm]       = useState('')
    const [showPass, setShowPass]     = useState(false)
    const [showConf, setShowConf]     = useState(false)
    const [loading, setLoading]       = useState(false)
    const [message, setMessage]       = useState('')
    const [isError, setIsError]       = useState(false)

    {/* Implementando para proteger la ruta para restablecer contraseña */}
    useEffect(() => {
        if (!uid || !token) {
            router.replace('/login') 
        }
    }, [uid, token, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage('')

    if (password.length < RESET_CONSTRAINTS.MIN_PASSWORD_LENGTH) {
        setMessage(RESET_MESSAGES.TOO_SHORT)
        setIsError(true)
        return
    }

    if (password !== confirm) {
        setMessage(RESET_MESSAGES.MISMATCH)
        setIsError(true)
        return
    }

    setLoading(true)
    try {
        await api.post('/auth/reset-password/', { uid, token, password })
        setMessage(RESET_MESSAGES.SUCCESS)
        setIsError(false)
        setTimeout(() => router.push('/login'), 3000)
    } catch {
        setMessage(RESET_MESSAGES.ERROR)
        setIsError(true)
    } finally {
        setLoading(false)
    }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

      {/* Fondo */}
    <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url('/login-bg.jpeg')` }}
    />
    <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(64,206,228,0.4) 0%, rgba(198,0,126,0.3) 100%)' }}
    />

      {/* Logo top-left */}
    <div className="absolute top-9 left-14 z-10">
        <Image src="/Imagologo_motion.svg" alt="Motion" width={36} height={36}
        className="object-contain" style={{ width: '55px', height: 'auto' }} />
    </div>

      {/* Card */}
    <motion.div
        className="relative z-10 bg-[#FCFCFC] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.10)] w-full mx-4 flex flex-col"
        style={{ maxWidth: '560px', padding: '63px 40px', minHeight: '750px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
    >
        {/* Logo + Manager */}
        <div className="flex items-center justify-center gap-4 mb-10">
        <Image src="/Imagologo_motion.svg" alt="Motion Logo" width={64} height={64}
            className="object-contain flex-shrink-0" style={{ width: '100px', height: 'auto' }} />
        <div className="flex-shrink-0" style={{ width: '1px', height: '100px', backgroundColor: 'rgba(0,36,156,0.45)' }} />
        <span className="text-[34px] font-bold"
            style={{ fontFamily: 'var(--font-montserrat)', color: '#00249C', letterSpacing: '0.01em', paddingLeft: '6px' }}>
            Manager
        </span>
        </div>

        {/* Texto descriptivo */}
        <p className="text-center text-sm text-gray-500 px-16"
        style={{ fontFamily: 'var(--font-montserrat)', marginTop: '6rem', lineHeight: '1.6' }}>
        Ingresa tu nueva contraseña:
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 mt-10">

          {/* Nueva contraseña */}
        <div>
            <label className="block text-[13px] font-semibold uppercase mb-2 tracking-wide"
            style={{ fontFamily: 'var(--font-montserrat)', color: '#00249C', paddingLeft: '20px' }}>
            Nueva contraseña
            </label>
            <div className="relative">
            <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                maxLength={RESET_CONSTRAINTS.MAX_PASSWORD_LENGTH}
                style={{ fontFamily: 'var(--font-montserrat)', lineHeight: '48px', boxSizing: 'border-box' }}
                className="w-full h-[48px] pl-5 pr-12 rounded-full border border-[#E5E5E5] bg-transparent text-[15px] text-[#40CEE4] font-medium placeholder:text-[#40CEE4] placeholder:opacity-90 focus:outline-none focus:border-[#40CEE4] transition-all appearance-none"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8B8B8] hover:text-[#40CEE4] transition-colors">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
            </div>
        </div>

          {/* Confirmar contraseña */}
        <div>
            <label className="block text-[13px] font-semibold uppercase mb-2 tracking-wide"
            style={{ fontFamily: 'var(--font-montserrat)', color: '#00249C', paddingLeft: '20px' }}>
            Confirmar contraseña
            </label>
            <div className="relative">
            <input
                type={showConf ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                maxLength={RESET_CONSTRAINTS.MAX_PASSWORD_LENGTH}
                style={{ fontFamily: 'var(--font-montserrat)', lineHeight: '48px', boxSizing: 'border-box' }}
                className="w-full h-[48px] pl-5 pr-12 rounded-full border border-[#E5E5E5] bg-transparent text-[15px] text-[#40CEE4] font-medium placeholder:text-[#40CEE4] placeholder:opacity-90 focus:outline-none focus:border-[#40CEE4] transition-all appearance-none"
            />
            <button type="button" onClick={() => setShowConf(!showConf)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8B8B8] hover:text-[#40CEE4] transition-colors">
                {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
            </div>
        </div>

          {/* Mensaje */}
        <AnimatePresence>
            {message && (
            <motion.p
                className={`text-xs text-center ${isError ? 'text-[#D10087]' : 'text-green-600'}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
                {message}
            </motion.p>
            )}
        </AnimatePresence>

            {/* Botón  de Restablecer Contraseña*/}
            <div className="flex justify-center">
                <motion.button
                    type="submit"
                    disabled={loading}
                    style={{ paddingLeft: '20px', paddingRight: '20px' }}
                    className="h-[35px] min-w-[115px] rounded-full border border-[#40CEE4] bg-[#FCFCFC] text-[#40CEE4] text-[15px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:bg-[#40CEE4] hover:text-white transition-all disabled:opacity-60"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    {loading ? 'Guardando...' : 'Restablecer contraseña'}
                </motion.button>
            </div>
    
        </form>
        

        {/* Botón volver */}
        <div style={{ position: 'absolute', bottom: '50px', left: '64px' }}>
        <motion.button
            onClick={() => router.push('/login')}
            style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}
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

export default function ResetPasswordPage() {
    return (
    <Suspense>
        <ResetPasswordForm />
    </Suspense>
    )
}