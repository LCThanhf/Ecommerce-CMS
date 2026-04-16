import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '@/store/productsSlice'
import type { AppDispatch, RootState } from '@/store/store'

export type { Product } from '@/store/productsSlice'

const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items: products, loading, error, hasFetched } = useSelector((state: RootState) => state.products)

  useEffect(() => {
    if (!hasFetched && !loading) {
      dispatch(fetchProducts())
    }
  }, [dispatch, hasFetched, loading])

  return { products, loading, error, hasFetched }
}

export default useProducts
