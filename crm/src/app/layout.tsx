import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Aroma'z Home · Plataforma de Gestión",
  description: 'Sistema de gestión comercial interno — Aromaz Home',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={jakarta.className} style={{ height: '100%' }} suppressHydrationWarning>
      <body style={{ height: '100%', margin: 0 }}>{children}</body>
    </html>
  )
}
