import type { Category } from '~/types/category'
import type { ProductsResponse } from '~/types/product'

const API_BASE = 'https://dummyjson.com'

export interface ProductQuery {
  limit?: number
  skip?: number
  category?: string
  sortBy?: 'price' | 'rating' | 'title'
  order?: 'asc' | 'desc'
}

interface DummyCategory {
  slug: string
  name: string
  url: string
}

interface CategoryPreviewProduct {
  category: string
  thumbnail: string
}

interface CategoryPreviewResponse {
  products: CategoryPreviewProduct[]
}

const productsEndpoint = (category?: string) =>
  category
    ? `${API_BASE}/products/category/${encodeURIComponent(category)}`
    : `${API_BASE}/products`

export const productService = {
  async getProducts({
    limit = 12,
    skip = 0,
    category,
    sortBy,
    order,
  }: ProductQuery = {}): Promise<ProductsResponse> {
    const params: Record<string, string | number> = { limit, skip }

    if (sortBy) params.sortBy = sortBy
    if (order) params.order = order

    return await $fetch<ProductsResponse>(productsEndpoint(category), {
      params,
    })
  },

  async getCategories(): Promise<Category[]> {
    // One request for the category list, one for a thumbnail per category
    const [categoryList, previews] = await Promise.all([
      $fetch<DummyCategory[]>(`${API_BASE}/products/categories`),
      $fetch<CategoryPreviewResponse>(`${API_BASE}/products`, {
        params: { limit: 0, select: 'category,thumbnail' },
      }),
    ])

    const imageBySlug = new Map<string, string>()

    for (const product of previews.products) {
      if (!imageBySlug.has(product.category)) {
        imageBySlug.set(product.category, product.thumbnail)
      }
    }

    return categoryList.map((category) => ({
      ...category,
      image: imageBySlug.get(category.slug) ?? '',
    }))
  },
}
