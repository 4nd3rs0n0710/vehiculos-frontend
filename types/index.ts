/**
 * Tipos globales del proyecto.
 * Centralizados aquí para evitar duplicación y facilitar mantenimiento.
 */

/** Representa un vehículo tal como lo retorna la API */
export interface Vehicle {
    id:         number
    brand:      string  // Marca del vehículo
    locality:   string  // Localidad / lugar de llegada
    applicant:  string  // Nombre del aspirante
    created_at: string
    updated_at: string
}

/** Datos que se envían al crear o editar un vehículo */
export interface VehicleFormData {
    brand:     string
    locality:  string
    applicant: string
}

/** Usuario autenticado */
export interface User {
    id:       number
    username: string
    email:    string
    role:     'admin' | 'viewer'
}

/** Respuesta del endpoint de login */
export interface AuthTokens {
    access:   string           // JWT de acceso (corta duración)
    refresh:  string           // JWT de refresco (larga duración)
    role:     'admin' | 'viewer'
    username: string
}