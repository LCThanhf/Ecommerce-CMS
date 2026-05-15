import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge tailwind classes properly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
    })

    it('should handle conditional classes', () => {
      const isTrue = true;
      const isFalse = false;
      expect(cn('bg-red-500', isTrue && 'text-white', isFalse && 'p-4')).toBe('bg-red-500 text-white')
    })

    it('should resolve tailwind class conflicts', () => {
      // tailwind-merge resolves conflicts, so bg-blue-500 should override bg-red-500
      expect(cn('bg-red-500 p-4', 'bg-blue-500')).toBe('p-4 bg-blue-500')
    })

    it('should handle arrays and objects', () => {
      expect(cn(['bg-red-500', 'p-4'], { 'text-white': true, 'font-bold': false })).toBe('bg-red-500 p-4 text-white')
    })
  })
})
