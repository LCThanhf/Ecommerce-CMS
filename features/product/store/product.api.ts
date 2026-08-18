import { api } from '@/services/api'
import { from, Observable } from 'rxjs'

export const fetchProductsAPI = (): Observable<any[]> => {
  return from(api.get<any[]>('/productions'))
}
