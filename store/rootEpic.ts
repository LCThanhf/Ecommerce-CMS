import { combineEpics } from 'redux-observable'
import { searchDebounceEpic } from '../features/search/store/search.epic'
import { filterDebounceEpic } from '../features/filter/store/filter.epic'
import { cartPersistEpic, cartToastEpic } from '../features/cart/store/cart.epic'
import { fetchProductsEpic } from '../features/product/store/product.epic'

export const rootEpic = combineEpics(
  searchDebounceEpic,
  filterDebounceEpic,
  cartPersistEpic,
  cartToastEpic,
  fetchProductsEpic,
)
