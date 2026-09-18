import type { Metadata } from 'next'
import { Public_Sans } from 'next/font/google'

const publicSans = Public_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'HICAS Admin Portal',
  description: 'Trang quản trị sản phẩm HICAS',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${publicSans.className} font-sans antialiased text-slate-800`}>
      {children}
    </div>
  )
}

