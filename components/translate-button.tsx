'use client'

import { Globe } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setLanguage } from '@/features/language/store/language.slice'
import type { RootState, AppDispatch } from '@/store/store'

export const TranslateButton = () => {
  const dispatch = useDispatch<AppDispatch>()
  const lang = useSelector((state: RootState) => state.language.language)
  const hasHydrated = useSelector((state: RootState) => state.language.hasHydrated)

  const toggleLanguage = () => {
    dispatch(setLanguage(lang === 'en' ? 'vi' : 'en'))
  }

  // Before hydration, show English default to prevent SSR mismatches
  const displayLang = hasHydrated ? lang : 'en'

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-sky-300 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-sky-50/80 hover:border-sky-400 active:scale-95 md:h-12 md:gap-2 md:px-4 md:text-sm"
      aria-label="Toggle language"
    >
      <Globe className="h-4 w-4 text-[#00b7ee] shrink-0 md:h-5 md:w-5" />
      <span className="w-5 text-left uppercase md:w-6">{displayLang}</span>
    </button>
  )
}

export default TranslateButton
