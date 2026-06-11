import { cookies } from 'next/headers'
import type { Lang } from './i18n'

export async function getServerLang(): Promise<Lang> {
  const jar = await cookies()
  const val = jar.get('aromaz-lang')?.value
  return val === 'es' || val === 'en' ? val : 'es'
}
