'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Filter, Menu, Search, ShoppingBasket, ShoppingCart, UserRound } from 'lucide-react'
import { Suspense, useState } from 'react'

const ShopSection = dynamic(() => import('./sections/shop-section'))
const CartSection = dynamic(() => import('./sections/cart-section'))
const ProfileSection = dynamic(() => import('./sections/profile-section'))

type ViewKey = 'shop' | 'cart' | 'profile'

type NavItem = {
  key: ViewKey
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { key: 'shop', label: 'Shop', icon: ShoppingBasket },
  { key: 'cart', label: 'Cart', icon: ShoppingCart },
  { key: 'profile', label: 'My Profile', icon: UserRound },
]

function MainContent({ view }: { view: ViewKey }) {
  if (view === 'cart') {
    return (
      <Suspense
        fallback={
          <div className="flex min-h-115 items-center justify-center rounded-lg border border-neutral-300 bg-white/50 text-xl text-neutral-500">
            Loading...
          </div>
        }
      >
        <CartSection />
      </Suspense>
    )
  }

  if (view === 'profile') {
    return (
      <Suspense
        fallback={
          <div className="flex min-h-115 items-center justify-center rounded-lg border border-neutral-300 bg-white/50 text-xl text-neutral-500">
            Loading...
          </div>
        }
      >
        <ProfileSection />
      </Suspense>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-115 items-center justify-center rounded-lg border border-neutral-300 bg-white/50 text-xl text-neutral-500">
          Loading...
        </div>
      }
    >
      <ShopSection />
    </Suspense>
  )
}

export default function ShopPage() {
  const [activeView, setActiveView] = useState<ViewKey>('shop')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const currentViewLabel = navItems.find((item) => item.key === activeView)?.label ?? 'Shop'
  const stripSubtitle = activeView === 'shop' ? 'Shop' : currentViewLabel

  return (
    <main className="min-h-screen bg-[#ffffff] text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-sky-300/60 bg-[#C6E5F4]">
        <div className="flex h-16 items-center justify-between px-4 md:h-18 md:px-5">
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              aria-label="Go to shop main page"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] md:h-11 md:w-11"
            />
            <h1 className="text-2xl leading-none font-medium md:text-4xl">Mobile Shopping</h1>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-200 bg-white/80 text-slate-600 md:h-11 md:w-11"
            aria-label="Profile"
          >
            <UserRound className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4.5rem)]">
        <aside
          className={`min-h-full border-r border-neutral-300 bg-[#ffffff] transition-all duration-200 ${
            isCollapsed ? 'w-14 md:w-16' : 'w-52 md:w-60'
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-neutral-300 px-3 md:px-4">
            <span className={`${isCollapsed ? 'hidden' : 'block'} text-base font-normal md:text-lg`}>Menu</span>
            <button
              type="button"
              onClick={() => setIsCollapsed((previous) => !previous)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-neutral-600 hover:bg-neutral-200 md:h-9 md:w-9"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>

          <nav>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.key

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setActiveView(item.key)
                  }}
                  className={`flex h-12 w-full items-center gap-2 px-3 text-left text-base transition md:px-3 md:text-lg ${
                    isActive
                      ? 'border-y border-[#00b7ee] bg-[#e8f7ff] text-[#02a8df]'
                      : 'text-neutral-900 hover:bg-neutral-200/70'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
                  {!isCollapsed ? <span>{item.label}</span> : null}
                </button>
              )
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 pb-4">
          <div className="mb-4 border-b border-neutral-300 px-4 md:px-5">
            <div className="flex h-14 items-center justify-between gap-3">
              <h2 className="text-2xl leading-none font-bold md:text-3xl">{currentViewLabel}</h2>
            </div>

            <div className="flex h-12 items-center justify-between">
              <p className="text-lg leading-none font-normal text-neutral-900 md:text-xl">{stripSubtitle}</p>
              <div className="flex w-full max-w-120 items-stretch justify-end gap-2">
                <div className="flex min-w-0 flex-1 items-stretch overflow-hidden border border-neutral-500 bg-white">
                  <input
                    className="h-10 w-full px-3 text-base text-neutral-800 outline-none md:h-11 md:text-lg"
                    placeholder="Search..."
                    aria-label="Search products"
                  />
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center text-neutral-800 md:h-11 md:w-11"
                    aria-label="Search"
                  >
                    <Search className="h-6 w-6 md:h-7 md:w-7" />
                  </button>
                </div>

                <button
                  type="button"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-white text-neutral-800 md:h-11 md:w-11"
                  aria-label="Filter"
                >
                  <Filter className="h-6 w-6 md:h-7 md:w-7" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-5">
            <MainContent view={activeView} />
          </div>
        </section>
      </div>
    </main>
  )
}
