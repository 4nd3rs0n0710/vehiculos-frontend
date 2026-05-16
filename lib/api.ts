/**
 * Funciones de acceso a la API del backend.
 * 
 * Cada función encapsula una llamada HTTP específica,
 * manteniendo el resto del código desacoplado de Axios.
 */
import api from './axios'
import type { Vehicle, VehicleFormData, AuthTokens } from '@/types'

/**
 * Autentica al usuario y retorna los tokens JWT junto al rol.
 */
export const login = async (
    username: string,
    password: string
): Promise<AuthTokens> => {
    const { data } = await api.post('/auth/login/', { username, password })
    return data
}

/** Retorna la lista completa de vehículos */
export const getVehicles = async (): Promise<Vehicle[]> => {
    const { data } = await api.get('/vehiculos/')
    return data
}

/** Crea un nuevo vehículo y retorna el objeto creado */
export const createVehicle = async (payload: VehicleFormData): Promise<Vehicle> => {
    const { data } = await api.post('/vehiculos/', payload)
    return data
}

/** Actualiza parcialmente un vehículo por ID */
export const updateVehicle = async (
    id: number,
    payload: VehicleFormData
): Promise<Vehicle> => {
    const { data } = await api.patch(`/vehiculos/${id}/`, payload)
    return data
}

/** Elimina un vehículo por ID */
export const deleteVehicle = async (id: number): Promise<void> => {
    await api.delete(`/vehiculos/${id}/`)
}