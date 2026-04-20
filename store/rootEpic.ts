import { combineEpics } from 'redux-observable'
import { searchDebounceEpic } from '../features/search/search.epic'
import { filterDebounceEpic } from '../features/filter/filter.epic'
import { cartPersistEpic, cartToastEpic } from '../features/cart/cart.epic'
import { fetchProductsEpic } from '../features/product/product.epic'

export const rootEpic = combineEpics(
  searchDebounceEpic,
  filterDebounceEpic,
  cartPersistEpic,
  cartToastEpic,
  fetchProductsEpic,
)
