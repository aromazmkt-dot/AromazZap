'use client'

import { useLang } from '@/contexts/LanguageContext'

interface TopbarProps {
  title: string
  subtitle?: string
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { lang, setLang } = useLang()

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      marginBottom: 24,
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', color: 'var(--ink)' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 1 }}>{subtitle}</p>
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
              padding: '6px 14px',
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
            }}
          >
            {l}
          </button>
        ))}
      </div>
    </header>
  )
}
