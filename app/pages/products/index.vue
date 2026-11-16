<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { ProductFilters } from "~/types/product";
import { productService } from "~/services/productServices";
import { useShopProducts } from "~/composables/useShopProducts";

import ShopPageHeader from "~/components/shop/ShopPageHeader.vue";
import ShopCategoryNav from "~/components/shop/ShopCategoryNav.vue";
import ProductFiltersSidebar from "~/components/product/ProductFilters.vue";
import ProductSort from "~/components/product/ProductSort.vue";
import ProductGrid from "~/components/product/ProductGrid.vue";
import newsLetterSection from "~/components/home/newsLetterSection.vue";
import AppFoooter from "~/components/layout/AppFoooter.vue";

const route = useRoute();
const router = useRouter();

const selectedCategory = ref(
  typeof route.query.category === "string" ? route.query.category : "",
);

const selectedSort = useCookie<string>("shop-sort", {
  default: () => "default",
  sameSite: "lax",
});

const filters = ref<ProductFilters>({
  minPrice: null,
  maxPrice: null,
  brand: "",
  rating: null,
});



// SSR: fetch the initial products
const { data: initialProducts } = await useAsyncData(
  "shop-initial-products",
  () =>
    productService.getAllProducts({
      category: selectedCategory.value || undefined,
    }),
);

// SSR: fetch categories
const { data: categories } = await useAsyncData("shop-categories", () =>
  productService.getCategories(),
);

const {
  products,
  filteredProducts,
  paginatedProducts,
  currentPage,
  totalPages,
  loading,
  error,
  hasPrevious,
  visiblePages,
  hasNext,
  goToPage,
} = useShopProducts(
  initialProducts,
  selectedCategory,
  selectedSort,
  filters,
);

const activeCategoryName = computed(
  () =>
    categories.value?.find(
      (category) => category.slug === selectedCategory.value,
    )?.name ?? "",
);

usePageSeo(() => ({
  title: activeCategoryName.value
    ? `Shop ${activeCategoryName.value}`
    : "Shop All Products",
  description: activeCategoryName.value
    ? `Shop ${activeCategoryName.value} at FASCO. Compare styles, filter by brand, price and rating, and find your next favourite piece.`
    : "Browse all FASCO clothing, shoes and accessories. Filter by category, brand, price and rating to find the pieces you love.",
}));

// Keep URL in sync with category selection
watch(selectedCategory, (category) => {
  router.replace({
    query: {
      ...route.query,
      ...(category ? { category } : {}),
    },
  });
});

// Keep category selection in sync with browser navigation
watch(
  () => route.query.category,
  (category) => {
    selectedCategory.value = typeof category === "string" ? category : "";
  },
);

const brands = computed(() => {
  return [
    ...new Set(
      products.value
        .map((product) => product.brand)
        .filter((brand): brand is string => Boolean(brand)),
    ),
  ];
});


</script>

<template>
  <main class="shop-page container-global1">
    <ShopPageHeader :selected-category="selectedCategory" />

    <ShopCategoryNav
      v-model="selectedCategory"
      :categories="categories ?? []"
    />

    <div class="shop-page__layout">
      <ProductFiltersSidebar v-model="filters" :brands="brands" />

      <section class="shop-page__products" aria-label="Products">
        <div class="shop-page__toolbar">
          <p aria-live="polite">
            Showing {{ filteredProducts.length }} products
          </p>

          <ProductSort v-model="selectedSort" />
        </div>

        <ProductGrid :products="paginatedProducts" />

        <p v-if="loading" role="status" class="shop-page__loading">
          Loading products...
        </p>

        <p v-if="error" role="alert" class="shop-page__error">
          {{ error }}
        </p>

        <p v-if="!loading && !filteredProducts.length" role="status">
          No products match your filters.
        </p>
        <!-- Pagination -->
      <nav
  v-if="totalPages > 1"
  class="pagination"
  aria-label="Product pages"
>
          <button
            type="button"
            :disabled="!hasPrevious || loading"
            @click="goToPage(currentPage - 1)"
          >
            Previous
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            type="button"
            :aria-current="currentPage === page ? 'page' : undefined"
            :disabled="loading"
            :class="{ 'pagination__page--active': currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button
            type="button"
            :disabled="!hasNext || loading"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </nav>
      </section>
    </div>
    <newsLetterSection />
  </main>
  <AppFoooter />
</template>
