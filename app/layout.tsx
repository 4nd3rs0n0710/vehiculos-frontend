import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import PageTransition from '@/components/PageTransition'

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
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  )
}