import React from 'react'

interface AdminAuthLayoutProps {
  children: React.ReactNode
}

export const AdminAuthLayout: React.FC<AdminAuthLayoutProps> = ({ children }) => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white px-4 py-8 antialiased">
      <div className="w-full max-w-[380px] animate-in fade-in zoom-in-98 duration-300">
        {children}
      </div>
    </main>
  )
}
