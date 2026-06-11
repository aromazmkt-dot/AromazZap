import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import { signOut } from '@/app/login/actions'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { UIProvider } from '@/contexts/UIContext'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const sessionUser = {
    name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Usuario',
    email: user.email ?? '',
    role: user.user_metadata?.role ?? 'admin',
  }

  return (
    <LanguageProvider>
      <UIProvider>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar user={sessionUser} onSignOut={signOut} />
          <main className="app-main">
            {children}
          </main>
          <MobileNav />
        </div>
      </UIProvider>
    </LanguageProvider>
  )
}
