import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchPosts } from './product.api'

const MOCK_POSTS = [
  { id: 1, title: 'Post 1', body: 'Body 1', userId: 1 },
  { id: 2, title: 'Post 2', body: 'Body 2', userId: 1 },
]

describe('product.api', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals() // vi.restoreAllMocks() does NOT undo stubGlobal
  })

  it('should call the correct API endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_POSTS),
    })
    vi.stubGlobal('fetch', mockFetch)

    await fetchPosts()
    expect(mockFetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
  })

  it('should return the list of posts on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_POSTS),
    }))

    const posts = await fetchPosts()
    expect(posts).toHaveLength(2)
    expect(posts[0].id).toBe(1)
    expect(posts[0].title).toBe('Post 1')
  })

  it('should throw when the server returns a non-ok status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    await expect(fetchPosts()).rejects.toThrow('Bad response')
  })

  it('should throw on a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Failed to fetch')))
    await expect(fetchPosts()).rejects.toThrow('Failed to fetch')
  })
})
