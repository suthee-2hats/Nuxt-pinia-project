
import { ref } from 'vue'
import type { Category } from '~/types/category'

interface DummyProductResponse {
  products: {
    thumbnail: string
  }[]
}

export const useCategories = () => {
  const categories = ref<Category[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    pending.value = true
    error.value = null

    try {
      // Get the complete category list.
      const categoryList = await $fetch<Omit<Category, 'image'>[]>(
        'https://dummyjson.com/products/categories',
      )

      // Get one product image for each category.
      const categoryResults = await Promise.all(
        categoryList.map(async (category) => {
          const productData = await $fetch<DummyProductResponse>(
            `https://dummyjson.com/products/category/${encodeURIComponent(category.slug)}?limit=1`,
          )

          return {
            ...category,
            image: productData.products[0]?.thumbnail ?? '',
          }
        }),
      )

      categories.value = categoryResults
    } catch (err) {
      console.error('Unable to fetch categories:', err)
      error.value = 'Unable to load categories. Please try again.'
    } finally {
      pending.value = false
    }
  }

  return {
    categories,
    pending,
    error,
    fetchCategories,
  }
}
