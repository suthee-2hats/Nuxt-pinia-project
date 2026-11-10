<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem } from '~/types/cart'

const props = defineProps<{
  item: CartItem
}>()

const discountedPrice = computed(() => {
  return (
    props.item.price *
    (1 - props.item.discountPercentage / 100)
  )
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
</script>

<template>
    <article class="cart-item">
      <div class="cart-item__product">
        <div class="cart-item__image">
          <img
            :src="item.thumbnail"
            :alt="item.title"
            width="120"
            height="120"
          />
        </div>
  
        <div class="cart-item__details">
          <h2 class="cart-item__title">
            {{ item.title }}
          </h2>
  
          <p class="cart-item__color">
            Color: Red
          </p>
  
          <button class="cart-item__remove" type="button">
            Remove
          </button>
        </div>
      </div>
  
      <p class="cart-item__price">
        {{ formatPrice(discountedPrice) }}
      </p>
  
      <div class="cart-item__quantity">
        <span>{{ item.quantity }}</span>
      </div>
  
      <p class="cart-item__total">
        {{ formatPrice(discountedPrice * item.quantity) }}
      </p>
    </article>
  </template>