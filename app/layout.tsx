import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ReduxProvider } from '@/store/provider'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'My Website',
  description: 'A website built with Next.js and Tailwind CSS',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: 'hsl(var(--primary))',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} font-sans antialiased`}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  )
}
