<script setup lang="ts">
import { computed } from 'vue'
import type { ProductsResponse } from '~/types/product'
import { productService } from '~/services/productServices'

import ProductGallery from '~/components/product/ProductGallery.vue'
import ProductInfo from '~/components/product/ProductInfo.vue'
import RelatedProducts from '~/components/product/RelatedProducts.vue'

const route = useRoute()

const productId = computed(() => Number(route.params.id))

const { data: product, error } = await useAsyncData(
  () => `product-detail-${productId.value}`,
  () => productService.getProductById(productId.value),
  { watch: [productId] },
)

if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
    fatal: true,
  })
}

const category = computed(() => product.value?.category ?? '')

const categoryLabel = computed(() => {
  if (!category.value) return ''

  return category.value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
})

const { data: relatedData } = await useAsyncData<ProductsResponse>(
  () => `related-products-${category.value}`,
  () => {
    if (!category.value) {
      return Promise.resolve({
        products: [],
        total: 0,
        skip: 0,
        limit: 0,
      })
    }

    return productService.getRelatedProducts(category.value, 12)
  },
  { watch: [category] },
)

const relatedProducts = computed(() =>
  (relatedData.value?.products ?? [])
    .filter((item) => item.id !== product.value?.id)
    .slice(0, 8),
)

usePageSeo(() => {
  const current = product.value

  return {
    title: current?.title ?? 'Product',
    description:
      current?.description ??
      'Discover product details, pricing and availability at FASCO.',
    image: current?.images?.[0] ?? current?.thumbnail,
    type: 'product',
  }
})
</script>

<template>
  <div v-if="product" class="product-detail-page container-global1">
    <nav class="product-detail-page__breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>

        <li>
          <NuxtLink to="/products">Shop</NuxtLink>
        </li>

        <li>
          <NuxtLink
            :to="{ path: '/products', query: { category: product.category } }"
          >
            {{ categoryLabel }}
          </NuxtLink>
        </li>

        <li>
          <span aria-current="page">{{ product.title }}</span>
        </li>
      </ol>
    </nav>

    <article class="product-detail" aria-labelledby="product-title">
      <ProductGallery
        :images="product.images"
        :thumbnail="product.thumbnail"
        :title="product.title"
      />

      <ProductInfo :product="product" />
    </article>

    <RelatedProducts
      :products="relatedProducts"
      :category="product.category"
    />
  </div>
</template>
