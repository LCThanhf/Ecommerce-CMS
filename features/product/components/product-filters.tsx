import React from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'

type FilterState = {
  priceFrom: number
  priceTo: number
  ratingFrom: number
  ratingTo: number
}

interface ProductFiltersProps {
  filter: FilterState
  onFilterChange: (filter: FilterState) => void
}

const PRICE_OPTIONS = Array.from({ length: 11 }, (_, i) => i * 1_000_000)
const RATING_OPTIONS = [0, 1, 2, 3, 4, 5]

const formatVND = (value: number): string => {
  if (value === 0) return '0 VN\u0110'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0VN\u0110'
}

export const ProductFilters = ({
  filter,
  onFilterChange,
}: ProductFiltersProps) => {
  const { t } = useTranslation()
  const handlePriceFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filter, priceFrom: Number(e.target.value) })
  }

  const handlePriceToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filter, priceTo: Number(e.target.value) })
  }

  const handleRatingFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filter, ratingFrom: Number(e.target.value) })
  }

  const handleRatingToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filter, ratingTo: Number(e.target.value) })
  }

  return (
    <div className="absolute right-0 top-full z-50 mt-1 w-64 border border-neutral-200 bg-white px-5 py-4 shadow-lg">
      {/* Price Filter */}
      <div className="mb-4">
        <p className="mb-2 text-center text-sm font-normal text-neutral-500">{t('price')}</p>
        <div className="mb-2 flex items-center gap-3">
          <span className="w-9 shrink-0 text-sm text-neutral-500">{t('from')}</span>
          <div className="relative flex-1">
            <select
              value={filter.priceFrom}
              onChange={handlePriceFromChange}
              aria-label={t('price-from')}
              className="h-9 w-full appearance-none border border-neutral-300 bg-white pl-3 pr-8 text-sm text-neutral-800 outline-none"
            >
              {PRICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {formatVND(opt)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-9 shrink-0 text-sm text-neutral-500">{t('to')}</span>
          <div className="relative flex-1">
            <select
              value={filter.priceTo}
              onChange={handlePriceToChange}
              aria-label={t('price-to')}
              className="h-9 w-full appearance-none border border-neutral-300 bg-white pl-3 pr-8 text-sm text-neutral-800 outline-none"
            >
              {PRICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {formatVND(opt)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <p className="mb-2 text-center text-sm font-normal text-neutral-500">{t('rating')}</p>
        <div className="mb-2 flex items-center gap-3">
          <span className="w-9 shrink-0 text-sm text-neutral-500">{t('from')}</span>
          <div className="relative flex-1">
            <select
              value={filter.ratingFrom}
              onChange={handleRatingFromChange}
              aria-label={t('rating-from')}
              className="h-9 w-full appearance-none border border-neutral-300 bg-white pl-3 pr-8 text-sm text-neutral-800 outline-none"
            >
              {RATING_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} {opt === 1 ? t('star') : t('stars')}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-9 shrink-0 text-sm text-neutral-500">{t('to')}</span>
          <div className="relative flex-1">
            <select
              value={filter.ratingTo}
              onChange={handleRatingToChange}
              aria-label={t('rating-to')}
              className="h-9 w-full appearance-none border border-neutral-300 bg-white pl-3 pr-8 text-sm text-neutral-800 outline-none"
            >
              {RATING_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} {opt === 1 ? t('star') : t('stars')}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductFilters
