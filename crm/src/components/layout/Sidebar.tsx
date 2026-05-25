'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn, initials } from '@/lib/utils'
import {
  LayoutDashboard, Users, UserCheck, FileText, Receipt,
  Package, Settings, ChevronLeft, Menu, LogOut,
  BookOpen, ClipboardList, UsersRound, HardHat, CalendarClock,
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    label: 'Ventas',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/leads', label: 'Leads', icon: Users },
      { href: '/customers', label: 'Clientes', icon: UserCheck },
      { href: '/quotes', label: 'Cotizaciones', icon: FileText },
      { href: '/invoices', label: 'Facturas', icon: Receipt },
      { href: '/products', label: 'Productos', icon: Package },
    ],
  },
  {
    label: 'Organización',
    items: [
      { href: '/knowledge', label: 'Conocimiento', icon: BookOpen },
      { href: '/meetings', label: 'Acuerdos y Actas', icon: ClipboardList },
      { href: '/directory', label: 'Directorio', icon: UsersRound },
    ],
  },
  {
    label: 'Operaciones',
    items: [
      { href: '/installers', label: 'Instaladores', icon: HardHat },
      { href: '/expirations', label: 'Vencimientos', icon: CalendarClock },
    ],
  },
]

interface SidebarProps {
  user: { name: string; email: string; role: string }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <aside
      className={cn(
        'fixed top-2.5 left-2.5 bottom-2.5 z-40 flex flex-col rounded-2xl transition-all duration-200',
        'bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08]',
        'shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.07)]',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Header */}
      <div className="flex items-center h-[60px] px-4 border-b border-white/[0.06] flex-shrink-0 gap-3">
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <span className="text-white font-bold text-sm tracking-tight">Aromaz</span>
            <span className="text-zinc-500 text-sm"> CRM</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold mx-auto">A</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0',
            collapsed && 'mx-auto'
          )}
        >
          {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-1">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <div className="px-5 pt-3 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  {section.label}
                </span>
              </div>
            )}
            {collapsed && <div className="border-t border-white/[0.05] mx-3 my-2" />}
            {section.items.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 mx-2 my-0.5 rounded-xl text-sm font-medium transition-all duration-150 overflow-hidden whitespace-nowrap',
                  'border border-transparent',
                  isActive(href)
                    ? 'bg-blue-600/20 text-blue-200 border-blue-500/30 shadow-[0_2px_12px_rgba(37,99,235,0.2)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.07] hover:border-white/[0.06]'
                )}
              >
                <Icon size={17} className="flex-shrink-0" />
                {!collapsed && <span className="flex-1">{label}</span>}
              </Link>
            ))}
          </div>
        ))}

        {/* Settings at bottom */}
        {!collapsed && <div className="px-5 pt-3 pb-1"><span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Sistema</span></div>}
        {collapsed && <div className="border-t border-white/[0.05] mx-3 my-2" />}
        <Link
          href="/settings"
          title={collapsed ? 'Configuración' : undefined}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 mx-2 my-0.5 rounded-xl text-sm font-medium transition-all duration-150 border border-transparent',
            isActive('/settings')
              ? 'bg-blue-600/20 text-blue-200 border-blue-500/30 shadow-[0_2px_12px_rgba(37,99,235,0.2)]'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.07] hover:border-white/[0.06]'
          )}
        >
          <Settings size={17} className="flex-shrink-0" />
          {!collapsed && <span className="flex-1">Configuración</span>}
        </Link>
      </nav>

      {/* Footer / User */}
      <div className="flex-shrink-0 p-2 border-t border-white/[0.06]">
        <div className={cn(
          'flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer overflow-hidden',
          collapsed && 'justify-center'
        )}>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials(user.name)}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-100 truncate">{user.name}</p>
                <p className="text-xs text-zinc-500 truncate capitalize">{user.role}</p>
              </div>
              <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <LogOut size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
