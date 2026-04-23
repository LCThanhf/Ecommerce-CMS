import ProductDetailClient from '@/features/product/components/product-detail-client'

const ProductDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return <ProductDetailClient id={id} />
}

export default ProductDetailPage
