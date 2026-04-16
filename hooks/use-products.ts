import { useEffect, useState } from 'react'

// Shape trả về từ JSONPlaceholder /posts
type Post = {
  id: number
  title: string
  body: string
  userId: number
}

export type Product = {
  id: number
  name: string
  price: string
  priceValue: number
  rating: number
}

const PRODUCT_NAMES = [
  'Samsung Galaxy A31',
  'Samsung Galaxy A52',
  'Samsung Galaxy M32',
  'Samsung Galaxy S21 FE',
  'Samsung Galaxy A22',
  'Samsung Galaxy M52',
  'Samsung Galaxy A72',
  'Samsung Galaxy F62',
]

// Map một Post từ API → Product hiển thị trên UI
const mapPostToProduct = (post: Post, index: number): Product => {
  const priceValue = ((post.id % 10) + 1) * 1_000_000
  return {
    id: post.id,
    name: PRODUCT_NAMES[index % PRODUCT_NAMES.length],
    priceValue,
    price: priceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0VNĐ',
    rating: (post.id % 5) + 1,
  }
}

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        if (!res.ok) throw new Error('Bad response')
        return res.json() as Promise<Post[]>
      })
      .then((posts) => setProducts(posts.map(mapPostToProduct)))
      .catch(() => setError('Không thể tải sản phẩm. Vui lòng thử lại.'))
      .finally(() => setLoading(false))
  }, [])

  return { products, loading, error }
}

export default useProducts
