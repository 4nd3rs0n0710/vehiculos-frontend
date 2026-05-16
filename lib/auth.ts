/**
 * Utilidades para manejo de autenticación.
 * 
 * Los tokens se almacenan en cookies para que el middleware
 * de Next.js pueda leerlos y proteger las rutas en el servidor.
 */
import Cookies from 'js-cookie'
import type { AuthTokens } from '@/types'

// Claves usadas para las cookies
const ACCESS_KEY  = 'access_token'
const REFRESH_KEY = 'refresh_token'
const ROLE_KEY    = 'user_role'
const USER_KEY    = 'username'

/**
 * Guarda los tokens y datos del usuario en cookies.
 * El access token expira en 1 hora, el refresh en 7 días.
 */
export const saveTokens = (tokens: AuthTokens) => {
    Cookies.set(ACCESS_KEY,  tokens.access,   { expires: 1/24 })
    Cookies.set(REFRESH_KEY, tokens.refresh,  { expires: 7 })
    Cookies.set(ROLE_KEY,    tokens.role,     { expires: 7 })
    Cookies.set(USER_KEY,    tokens.username, { expires: 7 })
}

/** Obtiene el token de acceso actual */
export const getAccessToken  = () => Cookies.get(ACCESS_KEY)

/** Obtiene el token de refresco */
export const getRefreshToken = () => Cookies.get(REFRESH_KEY)

/** Obtiene el rol del usuario autenticado */
export const getRole = () => Cookies.get(ROLE_KEY) as 'admin' | 'viewer' | undefined

/** Obtiene el nombre de usuario */
export const getUsername = () => Cookies.get(USER_KEY)

/** Retorna true si el usuario tiene rol admin */
export const isAdmin = () => getRole() === 'admin'

/** Retorna true si hay un token de acceso activo */
export const isAuthenticated = () => !!getAccessToken()

/**
 * Elimina todas las cookies de sesión.
 * Se llama al cerrar sesión o cuando el token expira.
 */
export const clearTokens = () => {
    Cookies.remove(ACCESS_KEY)
    Cookies.remove(REFRESH_KEY)
    Cookies.remove(ROLE_KEY)
    Cookies.remove(USER_KEY)
}