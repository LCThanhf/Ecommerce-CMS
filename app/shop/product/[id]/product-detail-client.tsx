'use client'

import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, selectCartCount } from '@/store/cartSlice'
import type { AppDispatch, RootState } from '@/store/store'
import logoIcon from '../../../assets/logo.png'
import shopIcon from '../../../assets/shop.png'
import cartIcon from '../../../assets/cart.png'
import profileIcon from '../../../assets/profile.png'
import galaxyA31 from '../../../assets/samsung-galaxy-a31.png'
import galaxyA31Xanh from '../../../assets/samsung-galaxy-a31-xanh.png'
import galaxyA31Den from '../../../assets/samsung-galaxy-a31-den.png'
import galaxyA31Trang from '../../../assets/samsung-galaxy-a31-trang.png'
import AvatarDropdown from '@/components/avatar-dropdown'
import useAuthGuard from '@/hooks/use-auth-guard'

const PRODUCT_NAMES = [
  'Samsung Galaxy A31',
  'Samsung Galaxy A52',
  'Samsung Galaxy M32',
  'Samsung Galaxy S21 FE',
  'Samsung Galaxy A22',
  'Samsung Galaxy M52',
  'Samsung Galaxy A72',
  'Samsung Galaxy F62',
]

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  'Samsung Galaxy A31':
    'Galaxy A31 là mẫu smartphone tầm trung mới ra mắt đầu năm 2020 của Samsung. Thiết bị gây ấn tượng mạnh với ngoại hình thời trang, cụm 4 camera đa chức năng, vân tay dưới màn hình và viên pin khủng lên đến 5000 mAh.',
  'Samsung Galaxy A52':
    'Galaxy A52 nổi bật với màn hình Super AMOLED 90Hz, bộ tứ camera 64MP và khả năng chống nước IP67. Thiết bị mang lại trải nghiệm cao cấp trong tầm giá tầm trung với thiết kế trẻ trung, bền bỉ.',
  'Samsung Galaxy M32':
    'Galaxy M32 trang bị màn hình Super AMOLED 90Hz, pin 6000 mAh siêu bền và camera tứ 64MP đa năng. Đây là lựa chọn lý tưởng cho người dùng ưa thích xem phim và chụp ảnh mỗi ngày.',
  'Samsung Galaxy S21 FE':
    'Galaxy S21 FE mang đến trải nghiệm flagship với chip Snapdragon 888, màn hình Dynamic AMOLED 120Hz và hệ thống 3 camera đa năng. Thiết kế gọn nhẹ, phù hợp mọi đối tượng người dùng.',
  'Samsung Galaxy A22':
    'Galaxy A22 sở hữu màn hình Super AMOLED xuất sắc trong phân khúc giá rẻ, camera chính 48MP và pin 5000 mAh. Lý tưởng cho người dùng muốn sở hữu sản phẩm Samsung với chi phí hợp lý.',
  'Samsung Galaxy M52':
    'Galaxy M52 nổi bật với pin 5000 mAh sạc nhanh 25W, màn hình Super AMOLED 120Hz và chip Snapdragon 778G. Hiệu năng mạnh mẽ, đáp ứng mọi nhu cầu giải trí và công việc hàng ngày.',
  'Samsung Galaxy A72':
    'Galaxy A72 được trang bị màn hình Super AMOLED 90Hz kích thước lớn, camera 64MP OIS chống rung quang học cùng pin 5000 mAh. Thiết kế sang trọng, phù hợp giới văn phòng.',
  'Samsung Galaxy F62':
    'Galaxy F62 gây ấn tượng với viên pin khổng lồ 7000 mAh, chip Exynos 9825 mạnh mẽ và màn hình Super AMOLED sắc nét. Thiết bị lý tưởng cho người dùng năng động, thường xuyên di chuyển.',
}

const COLOR_VARIANTS = [
  { label: 'Xanh Dương', image: galaxyA31Xanh },
  { label: 'Đen', image: galaxyA31Den },
  { label: 'Trắng', image: galaxyA31Trang },
]

type NavKey = 'shop' | 'cart' | 'profile'

const navItems: { key: NavKey; label: string; icon: StaticImageData }[] = [
  { key: 'shop', label: 'Shop', icon: shopIcon },
  { key: 'cart', label: 'Cart', icon: cartIcon },
  { key: 'profile', label: 'My Profile', icon: profileIcon },
]

const RatingStar = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 59 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M47.7227 59.9961L29.4928 49.7439L11.2586 59.9886L14.7446 38.2831L-0.00270414 22.9072L20.3817 19.7446L29.5016 -0.00265632L38.6141 19.7488L58.9973 22.92L44.2447 38.2892L47.7227 59.9961Z"
        fill="#FFCC00"
      />
      <path
        d="M38.6758 19.623C29.444 33.0596 29.3438 33.2058 29.3438 33.2058L58.9352 22.845L38.6758 19.623Z"
        fill="#FFE680"
      />
      <path d="M29.4955 32.917V49.7877L11.0774 59.8945L29.4955 32.917Z" fill="#FFDD55" />
      <path d="M29.4955 32.917L47.6047 59.3803L44.2057 37.9488L29.4955 32.917Z" fill="#FFDD55" />
      <path d="M0.117065 22.8678L29.4971 32.9177L20.4195 19.6523L0.117065 22.8678Z" fill="#FFE680" />
      <path d="M29.4955 32.917V0.0409241L38.5572 19.6448L29.4955 32.917Z" fill="#FFDD55" />
      <path d="M11.2657 59.622L14.6866 38.0095L29.498 32.917L11.2657 59.622Z" fill="#FFD42A" />
    </svg>
  )
}

const ProductDetailClient = ({ id }: { id: string }) => {
  useAuthGuard()
  const router = useRouter()

  const productId = Number(id)
  const nameIndex = (productId - 1) % PRODUCT_NAMES.length
  const productName = PRODUCT_NAMES[nameIndex]
  const priceValue = ((productId % 10) + 1) * 1_000_000
  const rating = (productId % 5) + 1
  const priceFormatted =
    priceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0VN\u0110'
  const description =
    PRODUCT_DESCRIPTIONS[productName] ?? PRODUCT_DESCRIPTIONS['Samsung Galaxy A31']

  const dispatch = useDispatch<AppDispatch>()
  const cartCount = useSelector((state: RootState) => selectCartCount(state))
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(0)

  const addToCart = () => {
    dispatch(addItem({
      id: productId,
      name: `Điện thoại ${productName}`,
      description,
      priceValue,
      priceFormatted,
      qty: 1,
    }))
  }

  return (
    <main className="h-screen overflow-hidden bg-[#ffffff] text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-sky-300/60 bg-[#C6E5F4]">
        <div className="flex h-22 items-center justify-between px-4 md:h-26 md:px-5">
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              aria-label="Go to shop main page"
              className="inline-flex h-18 w-18 items-center justify-center md:h-20 md:w-20"
            >
              <Image src={logoIcon} alt="Shop logo" className="h-18 w-18 object-contain md:h-20 md:w-20" />
            </Link>
            <h1 className="text-xl leading-none font-normal sm:text-3xl md:text-[2.5rem]">Mobile Shopping</h1>
          </div>
          <AvatarDropdown />
        </div>
      </header>

      <div className="flex h-[calc(100vh-5.5rem)] overflow-hidden md:h-[calc(100vh-6.5rem)]">
        {/* Sidebar */}
        <aside
          className={`h-full overflow-hidden border-r border-neutral-300 bg-[#ffffff] transition-all duration-200 ${
            isCollapsed ? 'w-14 md:w-16' : 'w-14 sm:w-52 md:w-60'
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-neutral-300 px-3 md:px-4">
            <span className={`${isCollapsed ? 'hidden' : 'hidden sm:block'} text-base font-normal md:text-lg`}>Menu</span>
            <button
              type="button"
              onClick={() => setIsCollapsed((p) => !p)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-neutral-600 md:h-9 md:w-9"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
          <nav>
            {navItems.map((item) => {
              const isActive = item.key === 'shop'
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => router.push('/shop')}
                  className={`flex h-12 w-full items-center gap-2 px-3 text-left text-base transition md:px-3 md:text-lg ${
                    isActive
                      ? 'border-y border-[#00b7ee] bg-[#e8f7ff] text-[#02a8df]'
                      : 'text-neutral-900'
                  } ${isCollapsed ? 'justify-center px-0' : 'justify-center px-0 sm:justify-start sm:px-3'}`}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    className={`h-8 w-8 shrink-0 object-contain md:h-9 md:w-9 ${
                      isActive
                        ? 'filter-[invert(52%)_sepia(93%)_saturate(1695%)_hue-rotate(159deg)_brightness(95%)_contrast(98%)]'
                        : ''
                    }`}
                  />
                  {!isCollapsed ? <span className="hidden sm:inline">{item.label}</span> : null}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Content header */}
          <div className="shrink-0 border-b border-neutral-300 px-4 md:px-5">
            <div className="flex h-14 items-center">
              <h2 className="text-2xl leading-none font-bold md:text-3xl">Shop</h2>
            </div>
            <div className="flex h-12 items-center justify-between">
              <nav
                aria-label="breadcrumb"
                className="flex items-center gap-1.5 text-lg font-normal text-neutral-900 md:text-xl"
              >
                <Link href="/shop" className="hover:underline">Shop</Link>
                <span className="text-neutral-400">/</span>
                <span>Product</span>
              </nav>
              <Link
                href="/shop?view=cart"
                aria-label={`Giỏ hàng — ${cartCount} sản phẩm`}
                className="relative inline-flex h-10 w-10 items-center justify-center"
              >
                <Image src={cartIcon} alt="Cart" className="h-9 w-9 object-contain" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#F477FF] text-[11px] font-bold text-black">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Product detail body */}
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <div className="flex flex-col gap-8 md:flex-row md:gap-10">

              {/* Left: image + colour variants */}
              <div className="flex flex-col items-center -mt-4 sm:-mt-10">
                <div className="relative h-56 w-44 sm:h-96 sm:w-64 md:h-144 md:w-96 shrink-0">
                  <Image
                    src={galaxyA31}
                    alt={productName}
                    fill
                    sizes="384px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="mt-0 flex gap-2">
                  {COLOR_VARIANTS.map((variant, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedVariant(i)}
                      className="flex flex-col items-center gap-0.5 transition active:scale-95"
                    >
                      <div
                        className={`h-14 w-14 rounded border-2 p-2 ${
                          i === selectedVariant
                            ? 'border-sky-400'
                            : 'border-neutral-200 hover:border-sky-200'
                        }`}
                      >
                        <div className="relative h-full w-full">
                          <Image
                            src={variant.image}
                            alt={variant.label}
                            fill
                            sizes="40px"
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <span className="w-14 text-center text-[11px] text-neutral-600 leading-tight">
                        {variant.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: details */}
              <div className="flex flex-1 flex-col pt-2 sm:pt-10">
                <h1 className="text-lg font-bold leading-snug text-neutral-900 md:text-xl">
                  Điện thoại {productName}
                </h1>
                <p className="mt-10 max-w-2xl text-xl leading-9 text-neutral-600">
                  {description}
                </p>
                <p className="mt-10 text-2xl font-extrabold leading-none text-neutral-900 md:text-3xl">
                  {priceFormatted}
                </p>
                <div className="mt-4 flex items-center gap-1">
                  {Array.from({ length: rating }).map((_, i) => (
                    <RatingStar key={i} className="h-12 w-12 shrink-0" />
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-6">
                  <button
                    type="button"
                    onClick={() => { addToCart(); router.push('/shop?view=cart') }}
                    className="w-full sm:w-72 rounded-sm bg-[#00C2FF] py-5 text-2xl font-bold text-white transition hover:brightness-90 active:scale-95"
                  >
                    Mua Ngay
                  </button>
                  <button
                    type="button"
                    onClick={addToCart}
                    className="w-full sm:w-72 rounded-sm py-5 text-2xl font-bold text-white transition bg-[#00FF19] hover:brightness-90 active:scale-95"
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ProductDetailClient
