import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

export type Language = 'en' | 'vi'

const dictionary: Record<Language, Record<string, string>> = {
  en: {
    shop: 'Shop',
    cart: 'Cart',
    'my-profile': 'My Profile',
    profile: 'My Profile',
    logout: 'Log out',
    // Cart details
    'no-items': 'No items in cart yet.',
    'items-in-bag': 'Items in bag',
    subtotal: 'SubTotal',
    tax: 'Tax',
    total: 'Total',
    // Profile details
    dob: 'Date of birth:',
    sex: 'Sex:',
    male: 'Male',
    female: 'Female',
    'address-company': 'Address Company:',
    'address-home': 'Address Home:',
    // Product details
    product: 'Product',
    // Filter details
    price: 'Price',
    rating: 'Rating',
    from: 'From:',
    to: 'To:',
    star: 'Star',
    stars: 'Stars',
    'price-from': 'Price from',
    'price-to': 'Price to',
    'rating-from': 'Rating from',
    'rating-to': 'Rating to',
    // Other
    search: 'Search...',
    loading: 'Loading...',
  },
  vi: {
    shop: 'Cửa hàng',
    cart: 'Giỏ hàng',
    'my-profile': 'Hồ sơ của tôi',
    profile: 'Hồ sơ của tôi',
    logout: 'Đăng xuất',
    // Cart details
    'no-items': 'Chưa có sản phẩm nào trong giỏ hàng.',
    'items-in-bag': 'Sản phẩm trong giỏ hàng',
    subtotal: 'Tạm tính',
    tax: 'Thuế',
    total: 'Tổng cộng',
    // Profile details
    dob: 'Ngày sinh:',
    sex: 'Giới tính:',
    male: 'Nam',
    female: 'Nữ',
    'address-company': 'Địa chỉ công ty:',
    'address-home': 'Địa chỉ nhà riêng:',
    // Product details
    product: 'Sản phẩm',
    // Filter details
    price: 'Giá',
    rating: 'Đánh giá',
    from: 'Từ:',
    to: 'Đến:',
    star: 'Sao',
    stars: 'Sao',
    'price-from': 'Giá từ',
    'price-to': 'Giá đến',
    'rating-from': 'Đánh giá từ',
    'rating-to': 'Đánh giá đến',
    // Other
    search: 'Tìm kiếm...',
    loading: 'Đang tải...',
  },
}

export const useTranslation = () => {
  const lang = useSelector((state: RootState) => state.language.language)
  const hasHydrated = useSelector((state: RootState) => state.language.hasHydrated)

  const t = (key: string) => {
    // Default to 'en' before hydration to match Next.js server-side rendered HTML
    const activeLang = hasHydrated ? lang : 'en'
    return dictionary[activeLang]?.[key] || key
  }

  return { t, lang, hasHydrated }
}
