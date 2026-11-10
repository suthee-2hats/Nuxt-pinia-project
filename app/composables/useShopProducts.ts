import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { ProductsResponse } from '~/types/product'
import { productService } from '~/services/productServices'

const PAGE_SIZE = 12

export const useShopProducts = (
  initialData: Ref<ProductsResponse | null | undefined>,
  selectedCategory: Ref<string>,
  selectedSort: Ref<string>,
) => {
  const products = ref(initialData.value?.products ?? [])
  const total = ref(initialData.value?.total ?? 0)

  const loading = ref(false)
  const error = ref<string | null>(null)

  const skip = ref(products.value.length)

  const hasMore = computed(
    () => products.value.length < total.value,
  )

  const getSortOptions = () => {
    switch (selectedSort.value) {
      case 'price-asc':
        return { sortBy: 'price', order: 'asc' as const }

      case 'price-desc':
        return { sortBy: 'price', order: 'desc' as const }

      case 'rating-desc':
        return { sortBy: 'rating', order: 'desc' as const }

      default:
        return {}
    }
  }

  // Load the next page or reset the product list
  const loadProducts = async (reset = false) => {
    if (loading.value) return

    if (!reset && !hasMore.value) return

    loading.value = true
    error.value = null

    const requestSkip = reset ? 0 : skip.value

    try {
      const sortOptions = getSortOptions()

      const response = await productService.getProducts({
        limit: PAGE_SIZE,
        skip: requestSkip,
        category: selectedCategory.value || undefined,
        ...sortOptions,
      })

      if (reset) {
        products.value = response.products
      } else {
        products.value.push(...response.products)
      }

      total.value = response.total
      skip.value = response.skip + response.products.length
    } catch (err) {
      console.error('Unable to fetch products:', err)
      error.value = 'Unable to load products. Please try again.'
    } finally {
      loading.value = false
    }
  }

  // Reload when category or sorting changes
  watch(
    [selectedCategory, selectedSort],
    () => loadProducts(true),
  )

  // Keep initial SSR data in sync with the composable
  watch(initialData, (response) => {
    if (!response) return

    products.value = response.products
    total.value = response.total
    skip.value = response.products.length
  })

  return {
    products,
    total,
    loading,
    error,
    hasMore,
    loadProducts,
  }
}