import { ajax } from 'rxjs/ajax'
import type { Observable } from 'rxjs'
import type { Post } from './product.slice'

export const fetchPosts = (): Observable<Post[]> => {
  return ajax.getJSON<Post[]>('https://jsonplaceholder.typicode.com/posts')
}

