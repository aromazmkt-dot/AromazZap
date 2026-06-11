'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Users, UserCheck, FileText, Receipt,
  Package, Settings, ChevronLeft, Menu, LogOut,
  BookOpen, ClipboardList, UsersRound, HardHat, CalendarClock,
  TrendingUp,
} from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

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

  const NAV_SECTIONS = [
    {
      key: 'nav.section.operation',
      items: [
        { href: '/dashboard',  labelKey: 'nav.dashboard',   icon: TrendingUp },
        { href: '/leads',      labelKey: 'nav.leads',       icon: Users },
        { href: '/customers',  labelKey: 'nav.customers',   icon: UserCheck },
        { href: '/quotes',     labelKey: 'nav.quotes',      icon: FileText },
        { href: '/invoices',   labelKey: 'nav.invoices',    icon: Receipt },
        { href: '/products',   labelKey: 'nav.products',    icon: Package },
      ],
    },
    {
      key: 'nav.section.organization',
      items: [
        { href: '/knowledge',  labelKey: 'nav.knowledge',   icon: BookOpen },
        { href: '/meetings',   labelKey: 'nav.meetings',    icon: ClipboardList },
        { href: '/directory',  labelKey: 'nav.directory',   icon: UsersRound },
      ],
    },
    {
      key: 'nav.section.fieldops',
      items: [
        { href: '/installers',  labelKey: 'nav.installers',  icon: HardHat },
        { href: '/expirations', labelKey: 'nav.expirations', icon: CalendarClock },
      ],
    },
  ] as const

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <aside
      style={{
        width: collapsed ? 70 : 252,
        background: 'linear-gradient(185deg, var(--sb-1), var(--sb-2))',
        color: 'var(--sb-text)',
        position: 'fixed',
        top: 10,
        left: 10,
        bottom: 10,
        height: 'auto',
        borderRadius: 20,
        overflowY: 'auto',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width .22s cubic-bezier(.4,0,.2,1)',
        boxShadow: '0 8px 40px rgba(12,36,64,.35)',
      }}
    >
      {/* Glow overlay */}
      <div style={{
        position: 'absolute', inset: '0 0 auto 0', height: 200,
        background: 'radial-gradient(120% 80% at 20% 0%, rgba(30,127,204,.22), transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Brand */}
      <div style={{
        padding: '16px 12px 14px',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        marginBottom: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: 64,
      }}>
        {!collapsed ? (
          <Image
            src="/logo-aromaz-blanco.png"
            alt="Aromaz Home"
            width={120}
            height={36}
            style={{ objectFit: 'contain', width: 'auto', height: 36 }}
            priority
          />
        ) : (
          <Image
            src="/isotipo-aromaz.png"
            alt="Aromaz"
            width={34}
            height={34}
            style={{ objectFit: 'contain' }}
            priority
          />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            width: 26, height: 26, borderRadius: 8,
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
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: 1,
                color: 'var(--sb-muted)',
                textTransform: 'uppercase',
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    padding: collapsed ? '11px' : '10px 12px',
                    justifyContent: collapsed ? 'center' : undefined,
                    color: active ? '#fff' : 'var(--sb-text)',
                    fontWeight: active ? 600 : 500,
                    fontSize: 13,
                    borderRadius: 10,
                    position: 'relative',
                    transition: 'background .15s, color .15s',
                    background: active ? 'linear-gradient(90deg, rgba(30,127,204,.32), rgba(30,127,204,.12))' : 'transparent',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    marginBottom: 1,
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
        {!collapsed && (
          <div style={{ padding: '10px 12px 4px', fontSize: 9.5, fontWeight: 700, letterSpacing: 1, color: 'var(--sb-muted)', textTransform: 'uppercase' }}>
            {t('nav.section.system')}
          </div>
        )}
        {collapsed && <div style={{ height: 1, background: 'rgba(255,255,255,.06)', margin: '8px 6px' }} />}
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
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}
        >
          <Settings size={17} style={{ flexShrink: 0, opacity: 0.8 }} />
          {!collapsed && <span style={{ flex: 1 }}>{t('nav.settings')}</span>}
        </Link>
      </nav>

      {/* Logout */}
      <form action={onSignOut} style={{ padding: '6px 10px' }}>
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
            fontFamily: 'inherit',
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
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 99,
          background: 'linear-gradient(150deg, var(--brand), var(--brand-900))',
          color: '#fff', display: 'grid', placeItems: 'center',
          fontWeight: 700, fontSize: 11, flexShrink: 0,
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
  )
}
