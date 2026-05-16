/**
 * Layout raíz de la aplicación.
 * Carga la fuente Montserrat desde Google Fonts
 * y la aplica a toda la app via variable CSS.
 */
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Manager | Monitoring Innovation',
  description: 'Sistema de gestión de vehículos para concesionario',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${montserrat.className}`}>
        {children}
      </body>
    </html>
  )
}