import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'
import { signOut } from '@/app/login/actions'
import { LanguageProvider } from '@/contexts/LanguageContext'

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
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar user={sessionUser} onSignOut={signOut} />
        <main style={{
          marginLeft: 272,
          flex: 1,
          padding: '24px 30px 64px',
          transition: 'margin-left .22s cubic-bezier(.4,0,.2,1)',
          minWidth: 0,
          background: 'var(--bg)',
        }}>
          {children}
        </main>
      </div>
    </LanguageProvider>
  )
}
