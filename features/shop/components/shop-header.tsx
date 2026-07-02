import Link from 'next/link'
import Image from 'next/image'
import logoIcon from '@/app/assets/logo.png'
import AvatarDropdown from '@/components/avatar-dropdown'
import TranslateButton from '@/components/translate-button'

interface ShopHeaderProps {
  onViewChange: (view: 'shop' | 'profile') => void
}

export const ShopHeader = ({ onViewChange }: ShopHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-sky-300/60 bg-[#C6E5F4]">
      <div className="flex h-22 items-center justify-between px-4 md:h-26 md:px-5">
        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            aria-label="Go to shop main page"
            onClick={(event) => {
              event.preventDefault()
              onViewChange('shop')
            }}
            className="inline-flex h-18 w-18 items-center justify-center md:h-20 md:w-20"
          >
            <Image src={logoIcon} alt="Shop logo" className="h-18 w-18 object-contain md:h-20 md:w-20" />
          </Link>
          <h1 className="text-xl leading-none font-normal sm:text-3xl md:text-[2.5rem]">Mobile Shopping</h1>
        </div>

        <div className="flex items-center gap-3">
          <TranslateButton />
          <AvatarDropdown onProfileClick={() => onViewChange('profile')} />
        </div>
      </div>
    </header>
  )
}
