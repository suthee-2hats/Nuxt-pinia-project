
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { Product, ProductsResponse } from '~/types/product'
import { productService } from '~/services/productServices'

const PAGE_SIZE = 12

export const useShopProducts = (
  initialData: Ref<ProductsResponse | null | undefined>,
  selectedCategory: Ref<string>,
  selectedSort: Ref<string>,
) => {
  const products = ref<Product[]>(initialData.value?.products ?? [])
  const total = ref(initialData.value?.total ?? 0)

  const currentPage = ref(1)
  const loading = ref(false)
  const error = ref<string | null>(null)

  let requestId = 0

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / PAGE_SIZE)),
  )

  const hasPrevious = computed(() => currentPage.value > 1)
  const hasNext = computed(() => currentPage.value < totalPages.value)

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
  const visiblePages = computed(() => {
    const start = Math.max(1, currentPage.value - 1)
  
    const end = Math.min(
      totalPages.value,
      start + 3,
    )
  
    const adjustedStart = Math.max(1, end - 3)
  
    return Array.from(
      { length: end - adjustedStart + 1 },
      (_, index) => adjustedStart + index,
    )
  })

  const loadProducts = async (page = 1) => {
    const validPage = Math.min(Math.max(page, 1), totalPages.value)

    currentPage.value = validPage

    const currentRequestId = ++requestId

    loading.value = true
    error.value = null

    const skip = (validPage - 1) * PAGE_SIZE

    try {
      const response = await productService.getProducts({
        limit: PAGE_SIZE,
        skip,
        category: selectedCategory.value || undefined,
        ...getSortOptions(),
      })

      // Ignore an older response if a newer request has started.
      if (currentRequestId !== requestId) return

      products.value = response.products
      total.value = response.total
    } catch (err) {
      if (currentRequestId !== requestId) return

      console.error('Unable to fetch products:', err)
      error.value = 'Unable to load products. Please try again.'
    } finally {
      if (currentRequestId === requestId) {
        loading.value = false
      }
    }
  }

  const goToPage = (page: number) => {
    if (
      page < 1 ||
      page > totalPages.value ||
      page === currentPage.value ||
      loading.value
    ) {
      return
    }

    loadProducts(page)
  }

  // Reset pagination when the category or sorting changes.
  watch(
    [selectedCategory, selectedSort],
    () => {
      loadProducts(1)
    },
  )

  // Keep the composable synchronized with updated initial SSR data.
  watch(initialData, (response) => {
    if (!response) return

    requestId++

    products.value = response.products
    total.value = response.total
    currentPage.value = 1
    loading.value = false
    error.value = null
  })

  return {
    products,
    total,
    currentPage,
    totalPages,
    visiblePages,
    loading,
    error,
    hasPrevious,
    hasNext,
    loadProducts,
    goToPage,
  }
}
