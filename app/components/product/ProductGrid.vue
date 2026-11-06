<script setup lang="ts">
import type { Product } from '~/types/product'
import ProductCard from './ProductCard.vue'

defineProps<{
  products: Product[]
}>()
</script>

<template>
  <div class="product-grid">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>