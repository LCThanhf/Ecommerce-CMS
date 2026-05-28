export type FilterValues = {
  priceFrom: number
  priceTo: number
  ratingFrom: number
  ratingTo: number
}

export interface FilterState {
  filter: FilterValues
  debouncedFilter: FilterValues
}
