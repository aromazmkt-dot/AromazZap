'use client'

import { Bell, Search } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="h-[60px] border-b border-zinc-200 bg-white flex items-center px-6 gap-4 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-zinc-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-zinc-500 truncate">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-lg text-sm text-zinc-500 cursor-pointer hover:bg-zinc-200 transition-colors min-w-[220px]">
        <Search size={14} className="flex-shrink-0" />
        <span className="flex-1">Buscar leads, clientes, facturas…</span>
        <kbd className="text-[10px] bg-white border border-zinc-200 rounded px-1.5 py-0.5 font-mono text-zinc-400">⌘K</kbd>
      </div>

      {/* Notifications */}
      <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
        <Bell size={17} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      </button>
    </header>
  )
}
