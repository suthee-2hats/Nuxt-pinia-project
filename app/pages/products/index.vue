<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ProductFilters } from '~/types/product'
import { productService } from '~/services/productServices'
import { useShopProducts } from '~/composables/useShopProducts'
import { useInfiniteScroll } from '~/composables/useInfiniteScroll'

import ShopPageHeader from '~/components/shop/ShopPageHeader.vue'
import ShopCategoryNav from '~/components/shop/ShopCategoryNav.vue'
import ProductFiltersSidebar from '~/components/product/ProductFilters.vue'
import ProductSort from '~/components/product/ProductSort.vue'
import ProductGrid from '~/components/product/ProductGrid.vue'

const route = useRoute()
const router = useRouter()

const selectedCategory = ref(
  typeof route.query.category === 'string'
    ? route.query.category
    : '',
)

const selectedSort = ref('default')

const filters = ref<ProductFilters>({
  minPrice: null,
  maxPrice: null,
  brand: '',
  rating: null,
})

// SSR: fetch the initial products
const { data: initialProducts } = await useAsyncData(
  'shop-initial-products',
  () =>
    productService.getProducts({
      category: selectedCategory.value || undefined,
      limit: 12,
      skip: 0,
    }),
)

// SSR: fetch categories
const { data: categories } = await useAsyncData(
  'shop-categories',
  () => productService.getCategories(),
)

const {
  products,
  loading,
  error,
  hasMore,
  loadProducts,
} = useShopProducts(
  initialProducts,
  selectedCategory,
  selectedSort,
)

// Keep URL in sync with category selection
watch(selectedCategory, (category) => {
  router.replace({
    query: {
      ...route.query,
      ...(category ? { category } : {}),
    },
  })
})

// Keep category selection in sync with browser navigation
watch(
  () => route.query.category,
  (category) => {
    selectedCategory.value =
      typeof category === 'string' ? category : ''
  },
)

const brands = computed(() => {
  return [
    ...new Set(
      products.value
        .map((product) => product.brand)
        .filter((brand): brand is string => Boolean(brand)),
    ),
  ]
})

// Client-side additional filters
const filteredProducts = computed(() =>
  products.value.filter((product) => {
    const matchesMin =
      filters.value.minPrice === null ||
      product.price >= filters.value.minPrice

    const matchesMax =
      filters.value.maxPrice === null ||
      product.price <= filters.value.maxPrice

    const matchesBrand =
      !filters.value.brand ||
      product.brand === filters.value.brand

    const matchesRating =
      filters.value.rating === null ||
      product.rating >= filters.value.rating

    return (
      matchesMin &&
      matchesMax &&
      matchesBrand &&
      matchesRating
    )
  }),
)

// Infinite scroll
const scrollTarget = ref<HTMLElement | null>(null)

useInfiniteScroll(scrollTarget, () => {
  if (hasMore.value && !loading.value) {
    loadProducts()
  }
})
</script>

<template>
  <main class="shop-page">
    <ShopPageHeader
      :selected-category="selectedCategory"
    />

    <ShopCategoryNav
      :categories="categories ?? []"
      v-model="selectedCategory"
    />

    <div class="shop-page__layout">
      <ProductFiltersSidebar
        v-model="filters"
        :brands="brands"
      />

      <section
        class="shop-page__products"
        aria-label="Products"
      >
        <div class="shop-page__toolbar">
          <p aria-live="polite">
            Showing {{ filteredProducts.length }} products
          </p>

          <ProductSort
            v-model="selectedSort"
          />
        </div>

        <ProductGrid
          :products="filteredProducts"
        />

        <p
          v-if="loading"
          role="status"
          class="shop-page__loading"
        >
          Loading products...
        </p>

        <p
          v-if="error"
          role="alert"
          class="shop-page__error"
        >
          {{ error }}
        </p>

        <p
          v-if="!loading && !filteredProducts.length"
          role="status"
        >
          No products match your filters.
        </p>

        <p
          v-if="!hasMore && products.length"
          class="shop-page__end"
        >
          You have reached the end of the products.
        </p>

        <div
          ref="scrollTarget"
          class="shop-page__scroll-trigger"
          aria-hidden="true"
        />
      </section>
    </div>
  </main>
</template>