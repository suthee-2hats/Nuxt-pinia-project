<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '~/types/product'
import ProductGrid from './ProductGrid.vue'

const props = defineProps<{
  products: Product[]
  category?: string
}>()

const categoryLabel = computed(() => {
  if (!props.category) return 'this category'

  return props.category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
})
</script>

<template>
  <section
    v-if="products.length"
    class="related-products"
    aria-labelledby="related-products-title"
  >
    <h2 id="related-products-title" class="related-products__title">
      More in {{ categoryLabel }}
    </h2>

    <ProductGrid :products="products" />
  </section>
</template>
