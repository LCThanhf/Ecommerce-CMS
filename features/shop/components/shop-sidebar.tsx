import Image, { type StaticImageData } from 'next/image'
import { Menu } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import shopIcon from '@/app/assets/shop.png'
import cartIcon from '@/app/assets/cart.png'
import profileIcon from '@/app/assets/profile.png'
import { useTranslation } from '@/hooks/use-translation'
import type { RootState } from '@/store/store'
import { toggleSidebar } from '@/features/shop/store/shop.slice'

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

interface ShopSidebarProps {
  activeView: ViewKey
  onViewChange: (view: ViewKey) => void
}

export const ShopSidebar = ({ activeView, onViewChange }: ShopSidebarProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isCollapsed = useSelector((state: RootState) => state.shop.isCollapsed)

  return (
    <aside
      className={`h-full overflow-hidden border-r border-neutral-300 bg-[#ffffff] transition-all duration-200 ${
        isCollapsed ? 'w-14 md:w-16' : 'w-14 sm:w-52 md:w-60'
      }`}
    >
      <div className="flex h-14 items-center justify-between border-b border-neutral-300 px-3 md:px-4">
        <span className={`${isCollapsed ? 'hidden' : 'hidden sm:block'} text-base font-normal md:text-lg`}>Menu</span>
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-neutral-600 md:h-9 md:w-9"
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
                onViewChange(item.key)
              }}
              className={`flex h-12 w-full items-center gap-2 px-3 text-left text-base transition md:px-3 md:text-lg ${
                isActive
                  ? 'border-y border-[#00b7ee] bg-[#e8f7ff] text-[#02a8df]'
                  : 'text-neutral-900'
              } ${isCollapsed ? 'justify-center px-0' : 'justify-center px-0 sm:justify-start sm:px-3'}`}
            >
              <Image
                src={item.icon}
                alt={t(item.key)}
                className={`h-8 w-8 shrink-0 object-contain md:h-9 md:w-9 ${
                  isActive
                    ? 'filter-[invert(52%)_sepia(93%)_saturate(1695%)_hue-rotate(159deg)_brightness(95%)_contrast(98%)]'
                    : ''
                }`}
              />
              {!isCollapsed ? <span className="hidden sm:inline">{t(item.key)}</span> : null}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
