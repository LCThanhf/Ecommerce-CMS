'use client'

import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, addItemSilent, selectCartCount } from '@/features/cart/store/cart.slice'
import { fetchProducts } from '@/features/product/store/product.slice'
import type { AppDispatch, RootState } from '@/store/store'
import logoIcon from '@/app/assets/logo.png'
import shopIcon from '@/app/assets/shop.png'
import cartIcon from '@/app/assets/cart.png'
import profileIcon from '@/app/assets/profile.png'
import AvatarDropdown from '@/components/avatar-dropdown'
import ToastNotification from '@/components/toast-notification'
import useAuthGuard from '@/features/auth/store/auth.hooks'
import RatingStar from './rating-star'
import TranslateButton from '@/components/translate-button'
import { useTranslation } from '@/hooks/use-translation'

type NavKey = 'shop' | 'cart' | 'profile'

const navItems: { key: NavKey; label: string; icon: StaticImageData }[] = [
  { key: 'shop', label: 'Shop', icon: shopIcon },
  { key: 'cart', label: 'Cart', icon: cartIcon },
  { key: 'profile', label: 'My Profile', icon: profileIcon },
]

const ProductDetailClient = ({ id }: { id: string }) => {
  useAuthGuard()
  const router = useRouter()
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const productId = Number(id)
  
  const product = useSelector((state: RootState) => state.products.items.find(p => p.id === productId))
  const hasFetched = useSelector((state: RootState) => state.products.hasFetched)
  
  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchProducts())
    }
  }, [hasFetched, dispatch])

  const cartCount = useSelector((state: RootState) => selectCartCount(state))
  const cartItems = useSelector((state: RootState) => state.cart.items)
  
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(0)

  // Wait for data to load
  if (!product && !hasFetched) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-neutral-500">
        Đang tải thông tin sản phẩm...
      </div>
    )
  }

  // Not found
  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-neutral-500">
        Sản phẩm không tồn tại
      </div>
    )
  }

  const productName = product.name
  const priceValue = product.priceValue
  const rating = product.rating || 5
  const priceFormatted = product.price
  const description = product.description || ''

  // Build images array
  const images = []
  if (product.image) images.push(product.image)
  if (product.subImage1) images.push(product.subImage1)
  if (product.subImage2) images.push(product.subImage2)
  if (product.subImage3) images.push(product.subImage3)

  // Current main image
  const currentImage = images[selectedVariant] || images[0]

  const addToCart = () => {
    dispatch(addItem({
      id: productId,
      name: productName,
      description,
      priceValue,
      priceFormatted,
      qty: 1,
      image: product.image,
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
          <div className="flex items-center gap-3">
            <TranslateButton />
            <AvatarDropdown />
          </div>
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

        {/* Main content */}
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Content header */}
          <div className="shrink-0 border-b border-neutral-300 px-4 md:px-5">
            <div className="flex h-14 items-center">
              <h2 className="text-2xl leading-none font-bold md:text-3xl">{t('shop')}</h2>
            </div>
            <div className="flex h-12 items-center justify-between">
              <nav
                aria-label="breadcrumb"
                className="flex items-center gap-1.5 text-lg font-normal text-neutral-900 md:text-xl"
              >
                <Link href="/shop" className="hover:underline">{t('shop')}</Link>
                <span className="text-neutral-400">/</span>
                <span>{t('product')}</span>
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

              {/* Left: image + gallery */}
              <div className="flex flex-col items-center -mt-4 sm:-mt-10">
                <div className="relative h-56 w-44 sm:h-96 sm:w-64 md:h-144 md:w-96 shrink-0 bg-white border border-slate-100 shadow-2xs rounded-xl flex items-center justify-center p-4">
                  {currentImage ? (
                    <Image
                      src={currentImage}
                      alt={productName}
                      fill
                      sizes="384px"
                      className="object-contain p-4"
                      priority
                    />
                  ) : (
                    <span className="text-slate-400 font-medium">Chưa có ảnh</span>
                  )}
                </div>
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedVariant(i)}
                        className={`h-16 w-16 rounded-lg border-2 p-1.5 overflow-hidden transition ${
                          i === selectedVariant
                            ? 'border-sky-400 shadow-sm'
                            : 'border-neutral-200 hover:border-sky-200'
                        }`}
                      >
                        <div className="relative h-full w-full">
                          {img && (
                            <Image
                              src={img}
                              alt={`Thumbnail ${i + 1}`}
                              fill
                              sizes="50px"
                              className="object-cover rounded-sm"
                            />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: details */}
              <div className="flex flex-1 flex-col pt-2 sm:pt-10">
                <h1 className="text-lg font-bold leading-snug text-neutral-900 md:text-xl">
                  {productName}
                </h1>
                <p className="mt-10 max-w-2xl text-xl leading-9 text-neutral-600">
                  {description}
                </p>
                <p className="mt-10 text-2xl font-extrabold leading-none text-neutral-900 md:text-3xl">
                  {priceFormatted}
                </p>
                <div className="mt-8 flex items-end gap-2">
                  <span className="text-3xl leading-none font-extrabold text-neutral-900">{rating}</span>
                  <RatingStar className="h-10 w-10 shrink-0 text-amber-400" />
                </div>
                <div className="mt-12 flex flex-wrap gap-6">
                  <button
                    type="button"
                    onClick={() => {
                      const alreadyInCart = cartItems.some((i) => i.id === productId)
                      if (!alreadyInCart) {
                        dispatch(addItemSilent({ id: productId, name: productName, description, priceValue, priceFormatted, qty: 1, image: product.image }))
                      }
                      router.push('/shop?view=cart')
                    }}
                    className="w-full sm:w-72 rounded-sm bg-[#00C2FF] py-5 text-2xl font-bold text-white transition hover:brightness-90 active:scale-95 shadow-sm"
                  >
                    Mua Ngay
                  </button>
                  <button
                    type="button"
                    onClick={addToCart}
                    className="w-full sm:w-72 rounded-sm py-5 text-2xl font-bold text-white transition bg-[#00FF19] hover:brightness-90 active:scale-95 shadow-sm"
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
      <ToastNotification />
    </main>
  )
}

export default ProductDetailClient
