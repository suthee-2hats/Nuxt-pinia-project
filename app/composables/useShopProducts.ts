
import { computed, ref, watch } from "vue";
import type { Ref } from "vue";
import type { Product, ProductsResponse, ProductFilters } from "~/types/product";
import { productService } from "~/services/productServices";

const PAGE_SIZE = 12;

export const useShopProducts = (
  initialData: Ref<ProductsResponse | null | undefined>,
  selectedCategory: Ref<string>,
  selectedSort: Ref<string>,
  filters: Ref<ProductFilters>,
) => {
  // Complete product collection
  const products = ref<Product[]>(initialData.value?.products ?? []);

  const currentPage = ref(1);
  const loading = ref(false);
  const error = ref<string | null>(null);

  let requestId = 0;

  // Apply price, brand, and rating filters
  const filteredProducts = computed(() => {
    return products.value.filter((product) => {
      const matchesMin =
        filters.value.minPrice === null ||
        product.price >= filters.value.minPrice;

      const matchesMax =
        filters.value.maxPrice === null ||
        product.price <= filters.value.maxPrice;

      const matchesBrand =
        !filters.value.brand ||
        product.brand === filters.value.brand;

      const matchesRating =
        filters.value.rating === null ||
        product.rating >= filters.value.rating;

      return (
        matchesMin &&
        matchesMax &&
        matchesBrand &&
        matchesRating
      );
    });
  });

  // Sort the filtered collection
  const sortedProducts = computed(() => {
    const result = [...filteredProducts.value];

    switch (selectedSort.value) {
      case "price-asc":
        return result.sort((a, b) => a.price - b.price);

      case "price-desc":
        return result.sort((a, b) => b.price - a.price);

      case "rating-desc":
        return result.sort((a, b) => b.rating - a.rating);

      default:
        return result;
    }
  });

  // Calculate pages from the filtered collection
  const totalPages = computed(() =>
    Math.ceil(sortedProducts.value.length / PAGE_SIZE),
  );

  // Display only 12 products on the current page
  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE;

    return sortedProducts.value.slice(start, start + PAGE_SIZE);
  });

  const hasPrevious = computed(() => currentPage.value > 1);
  const hasNext = computed(() => currentPage.value < totalPages.value);

  const visiblePages = computed(() => {
    const start = Math.max(1, currentPage.value - 1);
    const end = Math.min(totalPages.value, start + 3);
    const adjustedStart = Math.max(1, end - 3);

    return Array.from(
      { length: Math.max(0, end - adjustedStart + 1) },
      (_, index) => adjustedStart + index,
    );
  });

  // Fetch the complete collection when the category changes
  const loadProducts = async () => {
    const currentRequestId = ++requestId;

    loading.value = true;
    error.value = null;
    currentPage.value = 1;

    try {
      const response = await productService.getAllProducts({
        category: selectedCategory.value || undefined,
      });

      // Ignore outdated responses
      if (currentRequestId !== requestId) return;

      products.value = response.products;
    } catch (err) {
      if (currentRequestId !== requestId) return;

      console.error("Unable to fetch products:", err);
      error.value = "Unable to load products. Please try again.";
    } finally {
      if (currentRequestId === requestId) {
        loading.value = false;
      }
    }
  };

  // Navigate locally without another API request
  const goToPage = (page: number) => {
    if (
      page < 1 ||
      page > totalPages.value ||
      page === currentPage.value
    ) {
      return;
    }

    currentPage.value = page;
  };

  // Fetch again only when the category changes
  watch(selectedCategory, () => {
    loadProducts();
  });

  // Reset pagination when filters or sorting change
  watch(
    [filters, selectedSort],
    () => {
      currentPage.value = 1;
    },
    { deep: true },
  );

  // Synchronize updated SSR data
  watch(initialData, (response) => {
    if (!response) return;

    requestId++;
    products.value = response.products;
    currentPage.value = 1;
    loading.value = false;
    error.value = null;
  });

  return {
    products,
    filteredProducts,
    sortedProducts,
    paginatedProducts,
    currentPage,
    totalPages,
    visiblePages,
    loading,
    error,
    hasPrevious,
    hasNext,
    loadProducts,
    goToPage,
  };
};
