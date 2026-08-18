import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchProductsAPI } from './product.api'
import { api } from '@/services/api'
import { of, throwError, firstValueFrom } from 'rxjs'

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}))

const MOCK_PRODUCTIONS = [
  { id: 1, name: 'Product 1', price: 100, stockQuantity: 10, description: 'Desc 1', imageUrl: 'img1.jpg', rating: 4 },
  { id: 2, name: 'Product 2', price: 200, stockQuantity: 20, description: 'Desc 2', imageUrl: 'img2.jpg', rating: 5 },
]

describe('product.api', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call the correct API endpoint', async () => {
    vi.mocked(api.get).mockResolvedValue(MOCK_PRODUCTIONS)

    await firstValueFrom(fetchProductsAPI())
    expect(api.get).toHaveBeenCalledWith('/productions')
  })

  it('should return the list of products on success', async () => {
    vi.mocked(api.get).mockResolvedValue(MOCK_PRODUCTIONS)

    const products = await firstValueFrom(fetchProductsAPI())
    expect(products).toHaveLength(2)
    expect(products[0].id).toBe(1)
    expect(products[0].name).toBe('Product 1')
  })

  it('should propagate errors when the API fails', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Failed to fetch'))
    await expect(firstValueFrom(fetchProductsAPI())).rejects.toThrow('Failed to fetch')
  })
})
