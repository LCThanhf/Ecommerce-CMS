'use client'

import Link from 'next/link'
import Image, { type StaticImageData } from 'next/image'
import dynamic from 'next/dynamic'
import { Menu, ChevronDown } from 'lucide-react'
import { Suspense, useState } from 'react'
import logoIcon from '../assets/logo.png'
import avatarIcon from '../assets/avatar.png'
import shopIcon from '../assets/shop.png'
import cartIcon from '../assets/cart.png'
import profileIcon from '../assets/profile.png'
import searchIcon from '../assets/search.png'
import filterIcon from '../assets/filter.png'

const ShopSection = dynamic(() => import('./sections/shop-section'))
const CartSection = dynamic(() => import('./sections/cart-section'))
const ProfileSection = dynamic(() => import('./sections/profile-section'))

const PRICE_OPTIONS = Array.from({ length: 11 }, (_, i) => i * 1_000_000)
const RATING_OPTIONS = [0, 1, 2, 3, 4, 5]

function formatVND(value: number): string {
  if (value === 0) return '0 VN\u0110'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0VN\u0110'
}

type FilterState = {
  priceFrom: number
  priceTo: number
  ratingFrom: number
  ratingTo: number
}

type ViewKey = 'shop' | 'cart' | 'profile'

type NavItem = {
  key: ViewKey
  label: string
  icon: StaticImageData
}

const navItems: NavItem[] = [
  { key: 'shop', label: 'Shop', icon: shopIcon },
  { key: 'cart', label: 'Cart', icon: cartIcon },
  { key: 'profile', label: 'My Profile', icon: profileIcon },
]

function MainContent({
  view,
  searchQuery,
  filterState,
}: {
  view: ViewKey
  searchQuery: string
  filterState: FilterState
}) {
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
      <ShopSection
        searchQuery={searchQuery}
        priceFrom={filterState.priceFrom}
        priceTo={filterState.priceTo}
        ratingFrom={filterState.ratingFrom}
        ratingTo={filterState.ratingTo}
      />
    </Suspense>
  )
}

export default function ShopPage() {
  const [activeView, setActiveView] = useState<ViewKey>('shop')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [priceFrom, setPriceFrom] = useState(0)
  const [priceTo, setPriceTo] = useState(10_000_000)
  const [ratingFrom, setRatingFrom] = useState(0)
  const [ratingTo, setRatingTo] = useState(5)

  const currentViewLabel = navItems.find((item) => item.key === activeView)?.label ?? 'Shop'
  const stripSubtitle = activeView === 'shop' ? 'Shop' : currentViewLabel

  return (
    <main className="h-screen overflow-hidden bg-[#ffffff] text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-sky-300/60 bg-[#C6E5F4]">
        <div className="flex h-22 items-center justify-between px-4 md:h-26 md:px-5">
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              aria-label="Go to shop main page"
              onClick={() => setActiveView('shop')}
              className="inline-flex h-18 w-18 items-center justify-center md:h-20 md:w-20"
            >
              <Image src={logoIcon} alt="Shop logo" className="h-18 w-18 object-contain md:h-20 md:w-20" />
            </Link>
            <h1 className="text-3xl leading-none font-normal md:text-[2.5rem]">Mobile Shopping</h1>
          </div>

          <button
            type="button"
            className="inline-flex h-13 w-13 items-center justify-center overflow-hidden rounded-full border border-sky-200 bg-white text-slate-600 md:h-15 md:w-15"
            aria-label="Profile"
          >
            <Image src={avatarIcon} alt="Profile" className="h-full w-full rounded-full object-cover" />
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-5.5rem)] overflow-hidden md:h-[calc(100vh-6.5rem)]">
        <aside
          className={`h-full overflow-hidden border-r border-neutral-300 bg-[#ffffff] transition-all duration-200 ${
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
                  <Image
                    src={item.icon}
                    alt={item.label}
                    className={`h-5 w-5 shrink-0 object-contain md:h-6 md:w-6 ${
                      isActive
                        ? 'filter-[invert(52%)_sepia(93%)_saturate(1695%)_hue-rotate(159deg)_brightness(95%)_contrast(98%)]'
                        : ''
                    }`}
                  />
                  {!isCollapsed ? <span>{item.label}</span> : null}
                </button>
              )
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 overflow-hidden">
          <div className="mb-4 border-b border-neutral-300 px-4 md:px-5">
            <div className="flex h-14 items-center justify-between gap-3">
              <h2 className="text-2xl leading-none font-bold md:text-3xl">{currentViewLabel}</h2>
            </div>

            <div className="flex h-12 items-center justify-between">
              <p className="text-lg leading-none font-normal text-neutral-900 md:text-xl">{stripSubtitle}</p>
                <div className="relative flex items-stretch gap-2 w-full max-w-120 justify-end">
                <div className="flex min-w-0 flex-1 items-stretch overflow-hidden border border-neutral-500 bg-white">
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-10 w-full px-3 text-base text-neutral-800 outline-none md:h-11 md:text-lg"
                    placeholder="Search..."
                    aria-label="Search products"
                  />
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center text-neutral-800 md:h-11 md:w-11"
                    aria-label="Search"
                  >
                    <Image src={searchIcon} alt="Search" className="h-7 w-7 object-contain md:h-9 md:w-9" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className={`inline-flex h-11 w-11 shrink-0 items-center justify-center text-neutral-800 md:h-12 md:w-12 ${
                    isFilterOpen ? 'rounded-sm bg-sky-100 ring-1 ring-sky-300' : ''
                  }`}
                  aria-label="Filter"
                >
                  <Image src={filterIcon} alt="Filter" className="h-8 w-8 object-contain md:h-10 md:w-10" />
                </button>

                {isFilterOpen ? (
                  <div className="absolute right-0 top-full z-50 mt-1 w-64 border border-neutral-200 bg-white px-5 py-4 shadow-lg">
                    {/* Price Filter */}
                    <div className="mb-4">
                      <p className="mb-2 text-center text-sm font-normal text-neutral-500">Giá</p>
                      <div className="mb-2 flex items-center gap-3">
                        <span className="w-9 shrink-0 text-sm text-neutral-500">Từ:</span>
                        <div className="relative flex-1">
                          <select
                            value={priceFrom}
                            onChange={(e) => setPriceFrom(Number(e.target.value))}
                            aria-label="Giá từ"
                            className="h-9 w-full appearance-none border border-neutral-300 bg-white pl-3 pr-8 text-sm text-neutral-800 outline-none"
                          >
                            {PRICE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{formatVND(opt)}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-9 shrink-0 text-sm text-neutral-500">Đến:</span>
                        <div className="relative flex-1">
                          <select
                            value={priceTo}
                            onChange={(e) => setPriceTo(Number(e.target.value))}
                            aria-label="Giá đến"
                            className="h-9 w-full appearance-none border border-neutral-300 bg-white pl-3 pr-8 text-sm text-neutral-800 outline-none"
                          >
                            {PRICE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{formatVND(opt)}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
                        </div>
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <p className="mb-2 text-center text-sm font-normal text-neutral-500">Đánh giá</p>
                      <div className="mb-2 flex items-center gap-3">
                        <span className="w-9 shrink-0 text-sm text-neutral-500">Từ:</span>
                        <div className="relative flex-1">
                          <select
                            value={ratingFrom}
                            onChange={(e) => setRatingFrom(Number(e.target.value))}
                            aria-label="Đánh giá từ"
                            className="h-9 w-full appearance-none border border-neutral-300 bg-white pl-3 pr-8 text-sm text-neutral-800 outline-none"
                          >
                            {RATING_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt} Sao</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-9 shrink-0 text-sm text-neutral-500">Đến:</span>
                        <div className="relative flex-1">
                          <select
                            value={ratingTo}
                            onChange={(e) => setRatingTo(Number(e.target.value))}
                            aria-label="Đánh giá đến"
                            className="h-9 w-full appearance-none border border-neutral-300 bg-white pl-3 pr-8 text-sm text-neutral-800 outline-none"
                          >
                            {RATING_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt} Sao</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                </div>
            </div>
          </div>

          <div id="shop-scroll-container" className="h-[calc(100%-6.5rem)] overflow-y-auto px-4 pb-4 md:h-[calc(100%-6.5rem)] md:px-5">
            <MainContent
              view={activeView}
              searchQuery={searchQuery}
              filterState={{ priceFrom, priceTo, ratingFrom, ratingTo }}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
