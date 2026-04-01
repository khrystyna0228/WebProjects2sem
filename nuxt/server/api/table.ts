interface Product {
  id: number
  title: string
  description: string
  price: number
  rating: number
  brand: string
  category: string
  thumbnail: string
}

export default defineEventHandler(async () => {
  const first = await $fetch<{ products: Product[], total: number }>(
    'https://dummyjson.com/products?limit=0'
  )
  console.log('Total products:', first.total)

  const data = await $fetch<{ products: Product[] }>(
    `https://dummyjson.com/products?limit=${first.total}`
  )
  console.log('Fetched products:', data.products.length)

  return data.products
})
