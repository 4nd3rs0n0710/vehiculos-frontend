/**
 * useSignupForm — Custom Hook para el formulario de registro.
 * 
 * Principios aplicados:
 * - SRP: separa lógica de negocio del componente UI
 * - DIP: depende de abstracciones (lib/api), no implementaciones
 * - Clean Architecture: lógica de registro aislada del componente
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

/** Constraints de validación centralizados — sin números mágicos */
export const SIGNUP_CONSTRAINTS = {
  MAX_NAME_LENGTH: 30,
  MAX_EMAIL_LENGTH: 50,
  MAX_PASSWORD_LENGTH: 20,
  MIN_PASSWORD_LENGTH: 8,
} as const

/** Mensajes centralizados */
export const SIGNUP_MESSAGES = {
  SUCCESS: 'Cuenta creada exitosamente. Redirigiendo al login...',
  ERROR: 'Ocurrió un error al crear la cuenta. Intenta nuevamente.',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden.',
  TOO_SHORT: `La contraseña debe tener al menos ${SIGNUP_CONSTRAINTS.MIN_PASSWORD_LENGTH} caracteres.`,
  EMAIL_INVALID: 'El correo electrónico no es válido.',
} as const

/** Regex para validar solo letras en nombre/apellido */
export const ONLY_LETTERS_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]$/

/** Teclas permitidas en campos de solo texto */
export const ALLOWED_NAVIGATION_KEYS = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', ' ']

/** Interfaz del valor retornado por el hook */
export interface UseSignupFormReturn {
  firstName: string
  lastName: string
  email: string
  password: string
  confirm: string
  showPass: boolean
  showConf: boolean
  loading: boolean
  error: string
  success: boolean
  setFirstName: (v: string) => void
  setLastName: (v: string) => void
  setEmail: (v: string) => void
  setPassword: (v: string) => void
  setConfirm: (v: string) => void
  setShowPass: (v: boolean) => void
  setShowConf: (v: boolean) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleOnlyLetters: (e: React.KeyboardEvent) => void
}

/**
 * Hook que encapsula toda la lógica del formulario de registro.
 * El componente UI solo se encarga de renderizar.
 */
export function useSignupForm(): UseSignupFormReturn {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  /**
   * Bloquea caracteres no permitidos en campos de solo texto.
   * Permite letras, acentos, ñ y teclas de navegación.
   */
  const handleOnlyLetters = (e: React.KeyboardEvent) => {
    if (!ALLOWED_NAVIGATION_KEYS.includes(e.key) && !ONLY_LETTERS_REGEX.test(e.key)) {
      e.preventDefault()
    }
  }

  /**
   * Valida el formulario antes de enviarlo.
   * Retorna el mensaje de error o null si es válido.
   */
  const validate = (): string | null => {
    if (password.length < SIGNUP_CONSTRAINTS.MIN_PASSWORD_LENGTH)
      return SIGNUP_MESSAGES.TOO_SHORT
    if (password !== confirm)
      return SIGNUP_MESSAGES.PASSWORD_MISMATCH
    return null
  }

  /**
   * Maneja el envío del formulario.
   * Valida, llama al backend y redirige al login.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/register/', {
        first_name: firstName,
        last_name:  lastName,
        email,
        password,
      })
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string[]> } })?.response?.data
      if (data) {
        const firstError = Object.values(data)[0]
        setError(Array.isArray(firstError) ? firstError[0] : SIGNUP_MESSAGES.ERROR)
      } else {
        setError(SIGNUP_MESSAGES.ERROR)
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    firstName, lastName, email, password, confirm,
    showPass, showConf, loading, error, success,
    setFirstName, setLastName, setEmail, setPassword, setConfirm,
    setShowPass, setShowConf,
    handleSubmit, handleOnlyLetters,
  }
}