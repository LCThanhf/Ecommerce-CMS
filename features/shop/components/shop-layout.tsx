import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from '@/hooks/use-translation'
import type { RootState, AppDispatch } from '@/store/store'
import { setSearchQuery } from '@/features/search/store/search.slice'
import { setFilter } from '@/features/filter/store/filter.slice'
import { toggleFilter } from '@/features/shop/store/shop.slice'
import ProductFilters from '@/features/product/components/product-filters'
import useAuthGuard from '@/features/auth/store/auth.hooks'
import searchIcon from '@/app/assets/search.png'
import filterIcon from '@/app/assets/filter.png'
import { ShopHeader } from './shop-header'
import { ShopSidebar } from './shop-sidebar'
import { ShopContent } from './shop-content'

type ViewKey = 'shop' | 'cart' | 'profile'

export const ShopLayout = () => {
  useAuthGuard()
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()

  const dispatch = useDispatch<AppDispatch>()
  const searchQuery = useSelector((state: RootState) => state.search.searchQuery)
  const debouncedQuery = useSelector((state: RootState) => state.search.debouncedQuery)
  const filter = useSelector((state: RootState) => state.filter.filter)
  const debouncedFilter = useSelector((state: RootState) => state.filter.debouncedFilter)
  
  const isCollapsed = useSelector((state: RootState) => state.shop.isCollapsed)
  const isFilterOpen = useSelector((state: RootState) => state.shop.isFilterOpen)

  const activeViewParam = searchParams.get('view')
  const activeView: ViewKey =
    activeViewParam === 'cart' || activeViewParam === 'profile' ? activeViewParam : 'shop'

  const setView = (view: ViewKey) => {
    router.push(`/shop?view=${view}`)
  }

  const currentViewLabel = t(activeView)
  const stripSubtitle = activeView === 'shop' ? t('shop') : currentViewLabel

  return (
    <main className="h-screen overflow-hidden bg-[#ffffff] text-neutral-900">
      <ShopHeader onViewChange={setView} />

      <div className="flex h-[calc(100vh-5.5rem)] overflow-hidden md:h-[calc(100vh-6.5rem)]">
        <ShopSidebar activeView={activeView} onViewChange={setView} />

        <section className="min-w-0 flex-1 overflow-hidden">
          <div className={`px-4 md:px-5 ${activeView === 'shop' ? 'mb-4 border-b border-neutral-300' : ''}`}>
            <div className="flex h-14 items-center justify-between gap-3">
              <h2 className="text-2xl leading-none font-bold md:text-3xl">{currentViewLabel}</h2>
            </div>

            {activeView === 'shop' && (
              <div className="flex h-12 items-center justify-between">
                <p className="hidden sm:block text-lg leading-none font-normal text-neutral-900 md:text-xl">
                  {stripSubtitle}
                </p>
                <div className="relative flex items-stretch gap-2 w-full max-w-120 justify-end">
                  <div className="flex min-w-0 flex-1 items-stretch overflow-hidden border border-neutral-500 bg-white">
                    <input
                      value={searchQuery}
                      onChange={(event) => dispatch(setSearchQuery(event.target.value))}
                      className="h-10 w-full px-3 text-base text-neutral-800 outline-none md:h-11 md:text-lg"
                      placeholder={t('search')}
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
                    onClick={() => dispatch(toggleFilter())}
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center text-neutral-800 md:h-12 md:w-12 ${
                      isFilterOpen ? 'rounded-sm bg-sky-100 ring-1 ring-sky-300' : ''
                    }`}
                    aria-label="Filter"
                  >
                    <Image src={filterIcon} alt="Filter" className="h-8 w-8 object-contain md:h-10 md:w-10" />
                  </button>

                  {isFilterOpen && (
                    <ProductFilters
                      filter={filter}
                      onFilterChange={(newFilter) => dispatch(setFilter(newFilter))}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            id="shop-scroll-container"
            className={`overflow-y-auto px-4 md:px-5 ${
              activeView === 'shop' ? 'h-[calc(100%-6.5rem)] pb-0' : 'h-[calc(100%-3.5rem)] pb-4'
            }`}
          >
            <ShopContent
              view={activeView}
              searchQuery={debouncedQuery}
              filterState={debouncedFilter}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
