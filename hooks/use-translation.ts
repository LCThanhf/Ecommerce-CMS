import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
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
    other: 'Other',
    'address-company': 'Address Company:',
    'address-home': 'Address Home:',
    phone: 'Phone number:',
    'save-info': 'Save information',
    saving: 'Saving...',
    'save-success': 'Information saved successfully!',
    'avatar-remove': 'Remove image',
    'avatar-change': 'Change image',
    'avatar-remove-short': 'Remove',
    'avatar-change-short': 'Change',
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
    other: 'Khác',
    'address-company': 'Địa chỉ công ty:',
    'address-home': 'Địa chỉ nhà riêng:',
    phone: 'Số điện thoại:',
    'save-info': 'Lưu thông tin',
    saving: 'Đang lưu...',
    'save-success': 'Cập nhật thông tin thành công!',
    'avatar-remove': 'Gỡ ảnh đại diện',
    'avatar-change': 'Thay đổi ảnh đại diện',
    'avatar-remove-short': 'Gỡ',
    'avatar-change-short': 'Thay đổi',
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const t = (key: string) => {
    // Default to 'en' before hydration to match Next.js server-side rendered HTML
    const activeLang = mounted ? lang : 'en'
    return dictionary[activeLang]?.[key] || key
  }

  return { t, lang, hasHydrated: mounted }
}
