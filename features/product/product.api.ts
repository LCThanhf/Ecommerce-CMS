import type { Post } from './product.slice'

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  if (!response.ok) {
    throw new Error('Bad response')
  }
  return response.json() as Promise<Post[]>
}
