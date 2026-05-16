/**
 * Instancia de Axios configurada con interceptores JWT.
 * 
 * - Interceptor de REQUEST: adjunta automáticamente el Bearer token
 *   en cada petición para no tener que hacerlo manualmente.
 * 
 * - Interceptor de RESPONSE: si el servidor retorna 401 (token expirado),
 *   intenta renovarlo con el refresh token. Si falla, limpia la sesión
 *   y redirige al login con un mensaje de sesión expirada.
 */
import axios from 'axios'
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
})

/**
 * Interceptor de request.
 * Agrega el header Authorization: Bearer <token> si existe un token activo.
 */
api.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

/**
 * Interceptor de response.
 * Maneja errores 401 intentando renovar el token automáticamente.
 * Si el refresh también falla, redirige al login.
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config

    // Solo intenta renovar si es un 401 y no es un reintento
    if (error.response?.status === 401 && !original._retry) {
        original._retry = true
        const refresh = getRefreshToken()

        if (refresh) {
            try {
            // Intenta obtener un nuevo access token
            const { data } = await axios.post(`${API_URL}/auth/refresh/`, { refresh })
            saveTokens({
                access:   data.access,
                refresh:  data.refresh || refresh,
                role:     data.role,
                username: data.username,
            })
            // Reintenta la petición original con el nuevo token
            original.headers.Authorization = `Bearer ${data.access}`
            return api(original)
            } catch {
            // El refresh también falló — sesión inválida
            clearTokens()
            if (typeof window !== 'undefined') {
                window.location.href = '/login?expired=true'
            }
            }
        } else {
            // No hay refresh token disponible
            clearTokens()
            if (typeof window !== 'undefined') {
            window.location.href = '/login?expired=true'
            }
        }
    }

    return Promise.reject(error)
    }
)

export default api