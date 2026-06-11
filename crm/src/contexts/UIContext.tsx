'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type UICtx = {
  mobileSidebarOpen: boolean
  openMobileSidebar: () => void
  closeMobileSidebar: () => void
  toggleMobileSidebar: () => void
}

const Ctx = createContext<UICtx>({
  mobileSidebarOpen: false,
  openMobileSidebar: () => {},
  closeMobileSidebar: () => {},
  toggleMobileSidebar: () => {},
})

export function UIProvider({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setOpen] = useState(false)
  return (
    <Ctx.Provider value={{
      mobileSidebarOpen,
      openMobileSidebar: () => setOpen(true),
      closeMobileSidebar: () => setOpen(false),
      toggleMobileSidebar: () => setOpen(v => !v),
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useUI() { return useContext(Ctx) }
