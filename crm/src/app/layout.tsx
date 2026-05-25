import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Aromaz CRM',
  description: 'Sistema de gestión comercial interno — Aromaz Home',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="h-full bg-zinc-50 text-zinc-900 antialiased">{children}</body>
    </html>
  )
}
