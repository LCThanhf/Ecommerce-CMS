import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchPosts } from './product.api'
import { ajax } from 'rxjs/ajax'
import { of, throwError, firstValueFrom } from 'rxjs'

vi.mock('rxjs/ajax', () => ({
  ajax: {
    getJSON: vi.fn(),
  },
}))

const MOCK_POSTS = [
  { id: 1, title: 'Post 1', body: 'Body 1', userId: 1 },
  { id: 2, title: 'Post 2', body: 'Body 2', userId: 1 },
]

describe('product.api', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call the correct API endpoint', async () => {
    vi.mocked(ajax.getJSON).mockReturnValue(of(MOCK_POSTS))

    await firstValueFrom(fetchPosts())
    expect(ajax.getJSON).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
  })

  it('should return the list of posts on success', async () => {
    vi.mocked(ajax.getJSON).mockReturnValue(of(MOCK_POSTS))

    const posts = await firstValueFrom(fetchPosts())
    expect(posts).toHaveLength(2)
    expect(posts[0].id).toBe(1)
    expect(posts[0].title).toBe('Post 1')
  })

  it('should propagate errors when the API fails', async () => {
    vi.mocked(ajax.getJSON).mockReturnValue(throwError(() => new Error('Failed to fetch')))
    await expect(firstValueFrom(fetchPosts())).rejects.toThrow('Failed to fetch')
  })
})
