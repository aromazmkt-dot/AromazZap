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
        display: 'inline-flex',
        border: '1px solid var(--line)',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        flexShrink: 0,
      }}>
        {(['es', 'en'] as const).map((l, i) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: '7px 14px',
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '.4px',
              border: 0,
              borderLeft: i > 0 ? '1px solid var(--line)' : 0,
              background: lang === l ? 'var(--brand)' : 'var(--card)',
              color: lang === l ? '#fff' : 'var(--muted)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background .15s, color .15s',
              textTransform: 'uppercase',
              minHeight: 36,
            }}
          >
            {l}
          </button>
        ))}
      </div>
    </header>
  )
}
