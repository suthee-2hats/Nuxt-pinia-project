import type { Product } from '~/types/product'

export interface CartItem {
  productId: Product['id']
  title: Product['title']
  thumbnail: Product['thumbnail']
  price: Product['price']
  discountPercentage: Product['discountPercentage']
  stock: Product['stock']
  quantity: number
}