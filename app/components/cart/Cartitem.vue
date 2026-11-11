
<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem } from '~/types/cart'
import { useCartStore } from '~/stores/cart'

const props = defineProps<{
  item: CartItem
}>()

const cartStore = useCartStore()

const productLink = computed(() => `/products/${props.item.productId}`)

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

const removeFromCart = () => {
  cartStore.removeItem(props.item.productId)
}
</script>

<template>
  <article class="cart-item">
    <div class="cart-item__product">
      <NuxtLink
        :to="productLink"
        class="cart-item__image"
        :aria-label="`View ${item.title}`"
      >
        <img
          :src="item.thumbnail"
          alt=""
          width="120"
          height="120"
        />
      </NuxtLink>

      <div class="cart-item__details">
        <h2 class="cart-item__title">
          <NuxtLink :to="productLink">
            {{ item.title }}
          </NuxtLink>
        </h2>

        <button
          class="cart-item__remove"
          type="button"
          :aria-label="`Remove ${item.title} from cart`"
          @click="removeFromCart"
        >
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

