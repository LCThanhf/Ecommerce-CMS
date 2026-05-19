import { describe, it, expect, vi, afterEach } from 'vitest'
import { api } from './api'

describe('services/api', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals() // vi.restoreAllMocks() does NOT undo stubGlobal
  })

  it('should return parsed JSON on a successful response', async () => {
    const mockData = { id: 1, name: 'test' }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) }),
    )

    const result = await api.get<typeof mockData>('/endpoint')
    expect(result).toEqual(mockData)
    expect(fetch).toHaveBeenCalledWith('/endpoint')
  })

  it('should throw an error when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    await expect(api.get('/endpoint')).rejects.toThrow('Bad response')
  })

  it('should propagate network errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
    await expect(api.get('/endpoint')).rejects.toThrow('Network error')
  })
})
