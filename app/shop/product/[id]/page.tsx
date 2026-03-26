'use client'

import { use } from 'react'
import ProductDetailClient from './product-detail-client'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <ProductDetailClient id={id} />
}
