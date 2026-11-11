<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem } from '~/types/cart'

const props = defineProps<{
  items: CartItem[]
  shippingCost: number
}>()

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)

const lineTotal = (item: CartItem) =>
  item.price * (1 - item.discountPercentage / 100)

const subtotal = computed(() =>
  props.items.reduce(
    (total, item) => total + lineTotal(item) * item.quantity,
    0,
  ),
)

const total = computed(() => subtotal.value + props.shippingCost)

const itemCount = computed(() =>
  props.items.reduce((count, item) => count + item.quantity, 0),
)
</script>

<template>
  <section class="order-summary" aria-labelledby="order-summary-title">
    <h2 id="order-summary-title" class="order-summary__title">
      Order summary
      <span class="order-summary__count">
        ({{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }})
      </span>
    </h2>

    <ul class="order-summary__items">
      <li
        v-for="item in items"
        :key="item.productId"
        class="order-summary__item"
      >
        <div class="order-summary__image">
          <img
            :src="item.thumbnail"
            alt=""
            width="72"
            height="72"
            loading="lazy"
          />
          <span class="order-summary__quantity" aria-hidden="true">
            {{ item.quantity }}
          </span>
        </div>

        <div class="order-summary__product">
          <h3>{{ item.title }}</h3>
          <p>
            Qty {{ item.quantity }} ·
            {{ formatPrice(lineTotal(item)) }} each
          </p>
        </div>

        <p class="order-summary__item-price">
          {{ formatPrice(lineTotal(item) * item.quantity) }}
        </p>
      </li>
    </ul>

    <dl class="order-summary__totals">
      <div>
        <dt>Subtotal</dt>
        <dd>{{ formatPrice(subtotal) }}</dd>
      </div>

      <div>
        <dt>Shipping</dt>
        <dd>{{ formatPrice(shippingCost) }}</dd>
      </div>

      <div class="order-summary__grand-total">
        <dt>Total</dt>
        <dd>{{ formatPrice(total) }}</dd>
      </div>
    </dl>
  </section>
</template>
