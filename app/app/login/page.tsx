'use client'

/**
 * Página de login.
 * 
 * Maneja el flujo completo de autenticación:
 * - Valida credenciales contra el backend
 * - Guarda los tokens JWT en cookies
 * - Redirige al dashboard si ya hay sesión activa
 * - Muestra mensaje si la sesión expiró (?expired=true)
 * - Muestra errores de credenciales incorrectas
 */

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
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

    // Si ya hay sesión activa, redirige directo al dashboard
    useEffect(() => {
        if (isAuthenticated()) router.replace('/dashboard')
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

    try {
        const tokens = await login(username, password)
        saveTokens(tokens)
        router.push('/dashboard')
    } catch (err: unknown) {
      // Extrae el mensaje de error de la respuesta del backend
        const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail
        setError(msg || 'Credenciales incorrectas. Intenta de nuevo.')
    } finally {
        setLoading(false)
    }
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center">

      {/* Fondo con gradiente en colores de la marca */}
        <div
            className="absolute inset-0"
            style={{
            background: 'linear-gradient(135deg, rgba(0,36,156,0.6) 0%, rgba(64,206,228,0.4) 50%, rgba(198,0,126,0.5) 100%)',
            backgroundColor: '#c5d4f0',
        }}
        />

      {/* Logo top-left */}
        <div className="absolute top-5 left-6 flex items-center gap-2 z-10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#40CEE4] to-[#C6007E] flex items-center justify-center">
            <span className="text-white font-black text-sm">M</span>
        </div>
        </div>

      {/* Card de login con animación de entrada */}
        <motion.div
            className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
        {/* Encabezado de la card */}
        <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#40CEE4] to-[#C6007E] flex items-center justify-center shadow">
                <span className="text-white font-black text-base">M</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Manager</span>
        </div>

        {/* Alerta de sesión expirada */}
        <AnimatePresence>
            {expired && (
            <motion.div
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
            >
                Tu sesión ha expirado. Por favor inicia sesión nuevamente.
            </motion.div>
            )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Campo usuario */}
            <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Usuario
            </label>
            <div className="mt-1 relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C5C5C5]" />
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="nombre de usuario"
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-[#C5C5C5] rounded-lg text-sm focus:outline-none focus:border-[#40CEE4] transition-colors"
                />
            </div>
            </div>

          {/* Campo contraseña con toggle de visibilidad */}
            <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Contraseña
            </label>
            <div className="mt-1 relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C5C5C5]" />
                <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-10 py-2.5 border border-[#C5C5C5] rounded-lg text-sm focus:outline-none focus:border-[#40CEE4] transition-colors"
                />
                <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C5C5C5] hover:text-[#00249C]"
                >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
            </div>

          {/* Error de credenciales */}
            <AnimatePresence>
            {error && (
                <motion.p
                    className="text-[#C6007E] text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                {error}
                </motion.p>
            )}
            </AnimatePresence>

          {/* Botón de submit */}
            <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#00249C] text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 disabled:opacity-60 transition-all mt-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </motion.button>
        </form>

        {/* Links secundarios */}
        <div className="mt-5 flex justify-between text-xs text-[#C5C5C5]">
            <a href="#" className="hover:text-[#00249C] transition-colors">
                Olvidé mi contraseña
            </a>
            <a href="#" className="hover:text-[#C6007E] transition-colors">
                Registrarse
            </a>
        </div>
        </motion.div>
    </div>
    )
}

// Suspense requerido por Next.js al usar useSearchParams
export default function LoginPage() {
    return (
        <Suspense>
        <LoginForm />
        </Suspense>
    )
}