'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { t as translate, type Lang, type DictKey } from '@/lib/i18n'

type LangCtx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: DictKey, vars?: Record<string, string | number>) => string
}

const Ctx = createContext<LangCtx>({
  lang: 'es',
  setLang: () => {},
  t: k => k,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof document === 'undefined') return 'es'
    const cookie = document.cookie.split('; ').find(r => r.startsWith('aromaz-lang='))
    const val = cookie?.split('=')?.[1]
    return val === 'es' || val === 'en' ? val : 'es'
  })

  function setLang(l: Lang) {
    setLangState(l)
    document.cookie = `aromaz-lang=${l}; path=/; max-age=31536000; SameSite=Lax`
    document.documentElement.lang = l
  }

  function t(key: DictKey, vars?: Record<string, string | number>) {
    return translate(lang, key, vars)
  }

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}

export function useLang() {
  return useContext(Ctx)
}
