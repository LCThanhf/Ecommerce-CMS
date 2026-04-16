import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '@/store/productsSlice'
import type { AppDispatch, RootState } from '@/store/store'

export type { Product } from '@/store/productsSlice'

const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items: products, loading, error } = useSelector((state: RootState) => state.products)

  useEffect(() => {
    if (products.length === 0 && !loading && !error) {
      dispatch(fetchProducts())
    }
  }, [dispatch, products.length, loading, error])

  return { products, loading, error }
}

export default useProducts
