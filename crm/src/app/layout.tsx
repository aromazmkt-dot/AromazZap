import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: "Aroma'z Home · Plataforma de Gestión",
  description: 'Sistema de gestión comercial interno — Aromaz Home',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.className} style={{ height: '100%' }} suppressHydrationWarning>
      <body style={{ height: '100%', margin: 0 }}>{children}</body>
    </html>
  )
}
