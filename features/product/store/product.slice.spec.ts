import { describe, it, expect } from 'vitest'
import productReducer, { resetProducts, fetchProducts, fetchProductsSuccess, fetchProductsFailed, mapPostToProduct } from './product.slice'

describe('productSlice', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
    hasFetched: false,
  }

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(productReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })

    it('should handle resetProducts', () => {
      const state = {
        items: [{ id: 1, name: 'Phone', price: '10', priceValue: 10, rating: 5 }],
        loading: true,
        error: 'Error',
        hasFetched: true,
      }
      expect(productReducer(state, resetProducts())).toEqual(initialState)
    })

    it('should handle fetchProducts', () => {
      const actual = productReducer(initialState, fetchProducts())
      expect(actual.loading).toBe(true)
      expect(actual.error).toBeNull()
    })

    it('should handle fetchProductsSuccess', () => {
      const items = [{ id: 1, name: 'Phone', price: '10', priceValue: 10, rating: 5 }]
      const actual = productReducer(initialState, fetchProductsSuccess(items))
      expect(actual.loading).toBe(false)
      expect(actual.items).toEqual(items)
      expect(actual.hasFetched).toBe(true)
    })

    it('should handle fetchProductsFailed', () => {
      const errorMsg = 'Failed to fetch'
      const actual = productReducer(initialState, fetchProductsFailed(errorMsg))
      expect(actual.loading).toBe(false)
      expect(actual.error).toBe(errorMsg)
      expect(actual.hasFetched).toBe(true)
    })
  })

  describe('mapPostToProduct', () => {
    it('should correctly map a Post to a Product', () => {
      const post = { id: 11, title: 'Title', body: 'Body', userId: 1 }
      const product = mapPostToProduct(post, 0)
      
      expect(product.id).toBe(11)
      expect(product.name).toBe('Samsung Galaxy A31')
      expect(product.priceValue).toBe(2000000) // ((11 % 10) + 1) * 1,000,000 = (1 + 1) * 1,000,000
      expect(product.price).toBe('2\u00a0000\u00a0000\u00a0VNĐ')
      expect(product.rating).toBe(2) // (11 % 5) + 1 = 1 + 1 = 2
    })
  })
})
