import { describe, it, expect } from 'vitest'
import cartReducer, { hydrateCart, markCartHydrated, addItem, addItemSilent, removeItem, updateQty, selectCartCount, selectCartItems } from './cart.slice'
import type { CartItem } from './cart.slice'

describe('cartSlice', () => {
  const initialState = {
    items: [],
    hasHydrated: false,
  }

  const sampleItem: CartItem = {
    id: 1,
    name: 'Test Product',
    description: 'A test product',
    priceValue: 100,
    priceFormatted: '$100.00',
    qty: 1,
  }

  it('should return the initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle hydrateCart', () => {
    const actual = cartReducer(initialState, hydrateCart([sampleItem]))
    expect(actual.items).toEqual([sampleItem])
    expect(actual.hasHydrated).toBe(true)
  })

  it('should handle markCartHydrated', () => {
    const actual = cartReducer(initialState, markCartHydrated())
    expect(actual.hasHydrated).toBe(true)
  })

  it('should handle addItem', () => {
    const actual = cartReducer(initialState, addItem(sampleItem))
    expect(actual.items).toHaveLength(1)
    expect(actual.items[0]).toEqual(sampleItem)
    
    // Add same item again, qty should increase
    const actual2 = cartReducer(actual, addItem(sampleItem))
    expect(actual2.items).toHaveLength(1)
    expect(actual2.items[0].qty).toBe(2)
  })

  it('should handle addItemSilent', () => {
    const actual = cartReducer(initialState, addItemSilent(sampleItem))
    expect(actual.items).toHaveLength(1)
    
    // Add same item again
    const actual2 = cartReducer(actual, addItemSilent(sampleItem))
    expect(actual2.items[0].qty).toBe(2)
  })

  it('should handle removeItem', () => {
    const stateWithItem = {
      items: [sampleItem],
      hasHydrated: true,
    }
    const actual = cartReducer(stateWithItem, removeItem(1))
    expect(actual.items).toHaveLength(0)
  })

  it('should handle updateQty', () => {
    const stateWithItem = {
      items: [sampleItem],
      hasHydrated: true,
    }
    
    // Increase qty
    const actual = cartReducer(stateWithItem, updateQty({ id: 1, delta: 2 }))
    expect(actual.items[0].qty).toBe(3)
    
    // Decrease qty
    const actual2 = cartReducer(actual, updateQty({ id: 1, delta: -1 }))
    expect(actual2.items[0].qty).toBe(2)
    
    // Decrease to 0 should remove item
    const actual3 = cartReducer(actual2, updateQty({ id: 1, delta: -2 }))
    expect(actual3.items).toHaveLength(0)
  })

  describe('selectors', () => {
    const state = {
      cart: {
        items: [
          { ...sampleItem, id: 1, qty: 2 },
          { ...sampleItem, id: 2, qty: 3 },
        ],
        hasHydrated: true,
      }
    }

    it('selectCartCount should return total qty', () => {
      expect(selectCartCount(state)).toBe(5)
    })

    it('selectCartItems should return items array', () => {
      expect(selectCartItems(state)).toEqual(state.cart.items)
    })
  })
})
