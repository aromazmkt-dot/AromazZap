'use client'

import { useLang } from '@/contexts/LanguageContext'
import { useUI } from '@/contexts/UIContext'
import { Menu } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { lang, setLang } = useLang()
  const { toggleMobileSidebar } = useUI()

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      marginBottom: 24,
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
        {/* Hamburger — visible on mobile via CSS */}
        <button
          className="topbar-hamburger"
          onClick={toggleMobileSidebar}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', color: 'var(--ink)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* Language toggle */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        background: 'var(--card)', border: '1px solid var(--line)',
        borderRadius: 12, padding: 4,
        boxShadow: 'var(--shadow-sm)', flexShrink: 0,
      }}>
        {([
          { code: 'es', flag: '🇨🇱', label: 'ES' },
          { code: 'en', flag: '🇺🇸', label: 'EN' },
        ] as const).map(({ code, flag, label }) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 13px',
              fontSize: 12, fontWeight: 700,
              border: 0, borderRadius: 8,
              background: lang === code ? 'var(--brand)' : 'transparent',
              color: lang === code ? '#fff' : 'var(--muted)',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all .15s',
              boxShadow: lang === code ? '0 2px 8px -2px rgba(27,111,199,.4)' : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>{flag}</span>
            {label}
          </button>
        ))}
      </div>
    </header>
  )
}
