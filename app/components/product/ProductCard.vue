<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '~/types/product'

const props = defineProps<{
  product: Product
}>()

const discountedPrice = computed(() => {
  return (
    props.product.price *
    (1 - props.product.discountPercentage / 100)
  )
})

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
</script>

<template>
  <article class="product-card">
    <NuxtLink
      :to="`/products/${product.id}`"
      class="product-card__link"
    >
      <div class="product-card__image">
        <img
          :src="product.thumbnail"
          :alt="product.title"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div class="product-card__details">
        <h3 class="product-card__title">
          {{ product.title }}
        </h3>

        <p class="product-card__price">
          {{ formatPrice(discountedPrice) }}

          <del v-if="product.discountPercentage">
            {{ formatPrice(product.price) }}
          </del>
        </p>

        <p class="product-card__rating">
          <span aria-hidden="true">★</span>
          {{ product.rating }}
        </p>
      </div>
    </NuxtLink>
  </article>
</template>