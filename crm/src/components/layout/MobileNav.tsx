'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrendingUp, Users, Receipt, Inbox, CalendarClock } from 'lucide-react'
import { useLang } from '@/contexts/LanguageContext'

const NAV_ITEMS = [
  { href: '/dashboard',   icon: TrendingUp,    labelKey: 'nav.dashboard' as const },
  { href: '/inbox',       icon: Inbox,         labelKey: 'nav.inbox' as const },
  { href: '/leads',       icon: Users,         labelKey: 'nav.leads' as const },
  { href: '/invoices',    icon: Receipt,       labelKey: 'nav.invoices' as const },
  { href: '/expirations', icon: CalendarClock, labelKey: 'nav.expirations' as const },
]

export default function MobileNav() {
  const pathname = usePathname()
  const { t } = useLang()

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <nav className="mobile-nav">
      {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
        const active = isActive(href)
        return (
          <Link key={href} href={href} className={active ? 'active' : ''}>
            <Icon size={20} />
            <span>{t(labelKey)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
