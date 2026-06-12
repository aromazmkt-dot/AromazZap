'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Users, UserCheck, FileText, Receipt,
  Package, Settings, ChevronLeft, Menu, LogOut,
  BookOpen, ClipboardList, UsersRound, HardHat, CalendarClock,
  TrendingUp,
} from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'
import { useUI } from '@/contexts/UIContext'

interface SidebarProps {
  user: { name: string; email: string; role: string }
  onSignOut: () => Promise<void>
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function Sidebar({ user, onSignOut }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { t } = useLang()
  const { mobileSidebarOpen, closeMobileSidebar } = useUI()

  // Sync sidebar width CSS variable for desktop layout
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-w', collapsed ? '90px' : '272px')
  }, [collapsed])

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobileSidebar()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const NAV_SECTIONS = [
    {
      key: 'nav.section.operation' as const,
      items: [
        { href: '/dashboard',  labelKey: 'nav.dashboard' as const,   icon: TrendingUp },
        { href: '/leads',      labelKey: 'nav.leads' as const,       icon: Users },
        { href: '/customers',  labelKey: 'nav.customers' as const,   icon: UserCheck },
        { href: '/quotes',     labelKey: 'nav.quotes' as const,      icon: FileText },
        { href: '/invoices',   labelKey: 'nav.invoices' as const,    icon: Receipt },
        { href: '/products',   labelKey: 'nav.products' as const,    icon: Package },
      ],
    },
    {
      key: 'nav.section.organization' as const,
      items: [
        { href: '/knowledge',  labelKey: 'nav.knowledge' as const,   icon: BookOpen },
        { href: '/meetings',   labelKey: 'nav.meetings' as const,    icon: ClipboardList },
        { href: '/directory',  labelKey: 'nav.directory' as const,   icon: UsersRound },
      ],
    },
    {
      key: 'nav.section.fieldops' as const,
      items: [
        { href: '/installers',  labelKey: 'nav.installers' as const,  icon: HardHat },
        { href: '/expirations', labelKey: 'nav.expirations' as const, icon: CalendarClock },
      ],
    },
  ]

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  const sidebarWidth = collapsed ? 70 : 252

  return (
    <>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeMobileSidebar} />
      )}

      <aside
        className={`app-sidebar${mobileSidebarOpen ? ' mobile-open' : ''}`}
        style={{
          width: sidebarWidth,
          background: 'linear-gradient(185deg, var(--sb-1), var(--sb-2))',
          color: 'var(--sb-text)',
          position: 'fixed',
          top: 10,
          left: 10,
          bottom: 10,
          height: 'auto',
          borderRadius: 20,
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width .22s cubic-bezier(.4,0,.2,1)',
          boxShadow: '0 8px 40px rgba(12,36,64,.35)',
        }}
      >
        {/* Glow overlay */}
        <div style={{
          position: 'absolute', inset: '0 0 auto 0', height: 220,
          background: 'radial-gradient(130% 90% at 15% 0%, rgba(27,111,199,.28), transparent 65%)',
          pointerEvents: 'none',
        }} />
        {/* Bottom glow */}
        <div style={{
          position: 'absolute', inset: 'auto 0 0 0', height: 120,
          background: 'radial-gradient(100% 80% at 80% 100%, rgba(27,111,199,.12), transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Right edge highlight */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 1,
          background: 'linear-gradient(180deg, rgba(255,255,255,.08) 0%, rgba(255,255,255,.04) 40%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Brand */}
        <div style={{
          padding: '20px 14px 18px',
          borderBottom: '1px solid rgba(255,255,255,.07)',
          marginBottom: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: 80,
          flexShrink: 0,
        }}>
          {!collapsed ? (
            <Image
              src="/logo-aromaz-blanco.png"
              alt="Aromaz Home"
              width={160}
              height={52}
              style={{ objectFit: 'contain', width: 'auto', height: 52 }}
              priority
            />
          ) : (
            <Image
              src="/isotipo-aromaz.png"
              alt="Aromaz"
              width={42}
              height={42}
              style={{ objectFit: 'contain' }}
              priority
            />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              width: 28, height: 28, borderRadius: 8,
              border: '1px solid rgba(255,255,255,.10)',
              background: 'rgba(255,255,255,.05)',
              color: 'rgba(255,255,255,.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background .15s',
            }}
          >
            {collapsed ? <Menu size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '2px 10px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.key}>
              {!collapsed && (
                <div style={{
                  padding: '10px 12px 4px',
                  fontSize: 9.5, fontWeight: 700, letterSpacing: 1,
                  color: 'var(--sb-muted)', textTransform: 'uppercase',
                }}>
                  {t(section.key)}
                </div>
              )}
              {collapsed && <div style={{ height: 1, background: 'rgba(255,255,255,.06)', margin: '8px 6px' }} />}
              {section.items.map(({ href, labelKey, icon: Icon }) => {
                const active = isActive(href)
                const label = t(labelKey)
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 11,
                      padding: collapsed ? '11px' : '10px 12px',
                      justifyContent: collapsed ? 'center' : undefined,
                      color: active ? '#fff' : 'var(--sb-text)',
                      fontWeight: active ? 600 : 500,
                      fontSize: 13, borderRadius: 10,
                      position: 'relative',
                      transition: 'background .15s, color .15s',
                      background: active ? 'linear-gradient(90deg, rgba(30,127,204,.32), rgba(30,127,204,.12))' : 'transparent',
                      textDecoration: 'none', whiteSpace: 'nowrap', marginBottom: 1,
                      minHeight: 42,
                    }}
                  >
                    {active && (
                      <span style={{
                        position: 'absolute', left: -10, top: 8, bottom: 8,
                        width: 3, borderRadius: '0 3px 3px 0',
                        background: 'var(--brand)',
                        boxShadow: '0 0 12px rgba(30,127,204,.8)',
                      }} />
                    )}
                    <Icon size={17} style={{ flexShrink: 0, opacity: active ? 1 : 0.8, color: active ? '#7FB8EC' : undefined }} />
                    {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
                  </Link>
                )
              })}
            </div>
          ))}

          {/* Settings */}
          {!collapsed ? (
            <div style={{ padding: '10px 12px 4px', fontSize: 9.5, fontWeight: 700, letterSpacing: 1, color: 'var(--sb-muted)', textTransform: 'uppercase' }}>
              {t('nav.section.system')}
            </div>
          ) : (
            <div style={{ height: 1, background: 'rgba(255,255,255,.06)', margin: '8px 6px' }} />
          )}
          <Link
            href="/settings"
            title={collapsed ? t('nav.settings') : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: 11,
              padding: collapsed ? '11px' : '10px 12px',
              justifyContent: collapsed ? 'center' : undefined,
              color: isActive('/settings') ? '#fff' : 'var(--sb-text)',
              fontWeight: isActive('/settings') ? 600 : 500,
              fontSize: 13, borderRadius: 10,
              background: isActive('/settings') ? 'linear-gradient(90deg, rgba(30,127,204,.32), rgba(30,127,204,.12))' : 'transparent',
              textDecoration: 'none', whiteSpace: 'nowrap', minHeight: 42,
            }}
          >
            <Settings size={17} style={{ flexShrink: 0, opacity: 0.8 }} />
            {!collapsed && <span style={{ flex: 1 }}>{t('nav.settings')}</span>}
          </Link>
        </nav>

        {/* Logout */}
        <form action={onSignOut} style={{ padding: '6px 10px', flexShrink: 0 }}>
          <button
            type="submit"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '10px' : '10px 12px',
              justifyContent: collapsed ? 'center' : undefined,
              color: 'var(--sb-muted)', cursor: 'pointer',
              fontWeight: 500, fontSize: 13, borderRadius: 10,
              transition: 'background .15s, color .15s',
              width: '100%', border: 'none', background: 'none',
              fontFamily: 'inherit', minHeight: 44,
            }}
          >
            <LogOut size={15} style={{ flexShrink: 0, opacity: 0.7 }} />
            {!collapsed && <span>{t('nav.logout')}</span>}
          </button>
        </form>

        {/* Footer user */}
        <div style={{
          padding: collapsed ? '12px 0' : '14px 18px',
          borderTop: '1px solid rgba(255,255,255,.07)',
          fontSize: 11, color: 'var(--sb-muted)',
          display: 'flex', alignItems: 'center',
          gap: collapsed ? 0 : 10,
          justifyContent: collapsed ? 'center' : undefined,
          flexShrink: 0,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 99,
            background: 'linear-gradient(150deg, var(--brand), var(--brand-900))',
            color: '#fff', display: 'grid', placeItems: 'center',
            fontWeight: 700, fontSize: 11.5, flexShrink: 0,
          }}>
            {initials(user.name)}
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--sb-text)', fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ textTransform: 'capitalize', fontSize: 11 }}>{user.role}</div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
