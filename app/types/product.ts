export interface ProductDimensions {
  width: number
  height: number
  depth: number
}

export interface ProductReview {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface ProductMeta {
  createdAt: string
  updatedAt: string
  barcode: string
  qrCode: string
}

export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand?: string
  thumbnail: string
  images: string[]
  availabilityStatus?: string
  tags?: string[]
  sku?: string
  weight?: number
  dimensions?: ProductDimensions
  warrantyInformation?: string
  shippingInformation?: string
  returnPolicy?: string
  minimumOrderQuantity?: number
  reviews?: ProductReview[]
  meta?: ProductMeta
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface ProductFilters {
  minPrice: number | null
  maxPrice: number | null
  brand: string
  rating: number | null
}
