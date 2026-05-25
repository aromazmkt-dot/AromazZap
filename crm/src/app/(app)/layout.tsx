import Sidebar from '@/components/layout/Sidebar'

const MOCK_USER = { name: 'Marco Baeza', email: 'marco@aromazhome.com', role: 'admin' }

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <Sidebar user={MOCK_USER} />
      {/* Main content — offset by sidebar width + gap */}
      <div className="flex flex-col flex-1 min-w-0 ml-[calc(240px+10px)] transition-all duration-200">
        {children}
      </div>
    </div>
  )
}
