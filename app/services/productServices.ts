import type { Product, ProductsResponse } from "~/types/product";
import type { Category } from "~/types/category";
import { getApiBase } from "~/utils/api";

interface ProductRequestOptions {
  limit?: number;
  skip?: number;
  category?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export const productService = {
  // Fetch products
  getProducts(options: ProductRequestOptions = {}) {
    const { limit = 12, skip = 0, category, sortBy, order } = options;

    const endpoint = category
      ? `/products/category/${encodeURIComponent(category)}`
      : "/products";

    return $fetch<ProductsResponse>(`${getApiBase()}${endpoint}`, {
      query: {
        limit,
        skip,
        ...(sortBy ? { sortBy } : {}),
        ...(order ? { order } : {}),
      },
    });
  },

  // Fetch categories
  getCategories() {
    return $fetch<Category[]>(`${getApiBase()}/products/categories`);
  },

  // Fetch one product
  getProductById(id: number) {
    return $fetch<Product>(`${getApiBase()}/products/${id}`);
  },

  // Fetch products from the same category
  getRelatedProducts(category: string, limit = 8) {
    return $fetch<ProductsResponse>(
      `${getApiBase()}/products/category/${encodeURIComponent(category)}`,
      {
        query: { limit },
      },
    );
  },
};
