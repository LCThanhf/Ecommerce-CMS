import { describe, it, expect } from 'vitest'
import toastReducer, { showToast, hideToast } from './toast.slice'

describe('toastSlice', () => {
  const initialState = {
    message: null,
    visible: false,
  }

  it('should return the initial state', () => {
    expect(toastReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle showToast', () => {
    const message = 'Test Toast Message'
    const actual = toastReducer(initialState, showToast(message))
    expect(actual.message).toBe(message)
    expect(actual.visible).toBe(true)
  })

  it('should handle hideToast', () => {
    const activeState = {
      message: 'Active message',
      visible: true,
    }
    const actual = toastReducer(activeState, hideToast())
    expect(actual.message).toBeNull()
    expect(actual.visible).toBe(false)
  })
})
