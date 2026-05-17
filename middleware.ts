/**
 * Middleware de Next.js para protección de rutas.
 *
 * Intercepta cada request antes de renderizar la página:
 * - Sin token → redirige al login
 * - Con token en login → redirige al dashboard
 *
 * Principio aplicado: seguridad en capa de infraestructura (Clean Architecture)
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Rutas que requieren autenticación */
const PROTECTED_ROUTES = ['/dashboard', '/home']

/** Rutas que no deben ser accesibles con sesión activa */
const AUTH_ROUTES = ['/login']

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value
    const { pathname } = request.nextUrl

    // Sin token intentando entrar a ruta protegida → redirige al login
    const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
    if (!token && isProtected) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Con token intentando ir al login → redirige al dashboard
    const isAuthRoute = AUTH_ROUTES.some(route => pathname === route)
    if (token && isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
    }

    export const config = {
    matcher: ['/dashboard/:path*', '/home/:path*', '/login',  '/reset-password'],
}