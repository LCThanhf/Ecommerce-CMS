import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import galaxyA31 from '../../../assets/samsung-galaxy-a31.png'

const products = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  name: 'Samsung Galaxy A31',
  price: '6 940 000 VND'
}))

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const productId = Number(id)
  const product = products.find((item) => item.id === productId) ?? products[0]

  return (
    <main className="min-h-screen bg-white px-6 py-6 text-neutral-900 md:px-10">
      <Link href="/shop" className="text-sky-600 underline">
        Back to Shop
      </Link>

      <section className="mt-6 grid gap-8 rounded-lg border border-neutral-200 p-6 md:grid-cols-[220px_1fr] md:items-start md:gap-4">
        <div className="relative h-72 w-full max-w-55">
          <Image src={galaxyA31} alt={product.name} fill sizes="220px" className="object-contain" />
        </div>

        <div>
          <h1 className="text-3xl font-bold md:text-4xl">{product.name}</h1>
          <p className="mt-4 text-2xl font-extrabold md:text-3xl">{product.price}</p>
          <div className="mt-4 flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-6 w-6 fill-current" />
            ))}
          </div>
          <p className="mt-6 text-base leading-7 text-neutral-600">
            Product detail page placeholder. You can replace this content with your API data and specifications.
          </p>
        </div>
      </section>
    </main>
  )
}
