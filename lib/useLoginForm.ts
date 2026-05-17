/**
 * useLoginForm — Custom Hook para el formulario de login.
 *
 * Principios aplicados:
 * - SRP (Single Responsibility): separa la lógica del componente de UI.
 * - DIP (Dependency Inversion): depende de abstracciones (lib/api, lib/auth) no de implementaciones concretas.
 * - Clean Architecture: la lógica de autenticación no conoce nada de React Router ni de UI.
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/api'
import { saveTokens, isAuthenticated } from '@/lib/auth'

/** Restricciones de validación — constantes de negocio centralizadas */
export const LOGIN_CONSTRAINTS = {
  MAX_USERNAME_LENGTH: 20,
  MAX_PASSWORD_LENGTH: 20,
  ERROR_DISPLAY_DURATION_MS: 5000,
  SESSION_EXPIRED_REDIRECT_MS: 5000,
} as const

/** Mensajes de error centralizados — evita strings duplicados en la UI */
export const LOGIN_MESSAGES = {
  INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
} as const

/** Interfaz del valor retornado por el hook */
export interface UseLoginFormReturn {
  username: string
  password: string
  showPass: boolean
  error: string
  loading: boolean
  showExpired: boolean
  setUsername: (value: string) => void
  setPassword: (value: string) => void
  setShowPass: (value: boolean) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

/**
 * Hook que encapsula toda la lógica del formulario de login.
 * El componente de UI solo se encarga de renderizar.
 *
 * @param expired - Parámetro de URL que indica si la sesión expiró
 */
export function useLoginForm(expired: string | null): UseLoginFormReturn {
  const router = useRouter()

  const [username, setUsername]       = useState('')
  const [password, setPassword]       = useState('')
  const [showPass, setShowPass]       = useState(false)
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [showExpired, setShowExpired] = useState(false)

  /** Redirige al dashboard si ya hay una sesión activa */
  useEffect(() => {
    if (isAuthenticated()) router.replace('/dashboard')
  }, [router])

  /** Limpia el mensaje de error después de un tiempo definido */
  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(''), LOGIN_CONSTRAINTS.ERROR_DISPLAY_DURATION_MS)
    return () => clearTimeout(timer)
  }, [error])

  /** Muestra el mensaje de sesión expirada y redirige al login limpio */
  useEffect(() => {
    if (!showExpired) return
    const timer = setTimeout(() => {
      setShowExpired(false)
      router.replace('/login')
    }, LOGIN_CONSTRAINTS.SESSION_EXPIRED_REDIRECT_MS)
    return () => clearTimeout(timer)
  }, [showExpired, router])

  /** Activa el mensaje de sesión expirada si viene el parámetro en la URL */
  useEffect(() => {
    if (expired) setShowExpired(true)
  }, [expired])

  /**
   * Maneja el envío del formulario.
   * En caso de error limpia los campos para no exponer credenciales.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const tokens = await login(username, password)
      saveTokens(tokens)
      router.push('/dashboard')
    } catch {
      setError(LOGIN_MESSAGES.INVALID_CREDENTIALS)
      setUsername('')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return {
    username,
    password,
    showPass,
    error,
    loading,
    showExpired,
    setUsername,
    setPassword,
    setShowPass,
    handleSubmit,
  }
}