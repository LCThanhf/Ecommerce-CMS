'use client'

import { use } from 'react'
import ProductDetailClient from './product-detail-client'

const ProductDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params)
  return <ProductDetailClient id={id} />
}

export default ProductDetailPage
