<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Product } from '~/types/product'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()


const props = defineProps<{
  product: Product
}>()


const cartQuantity = computed(() =>
  cartStore.getItemQuantity(props.product.id),
)

const availableStock = computed(() =>
  Math.max(0, props.product.stock - cartQuantity.value),
)

const maxQuantity = computed(() => availableStock.value)

const minQuantity = computed(() =>
  Math.min(
    Math.max(1, props.product.minimumOrderQuantity ?? 1),
    maxQuantity.value,
  ),
)

const quantity = ref(minQuantity.value)
const statusMessage = ref('')

watch(
  () => props.product.id,
  () => {
    quantity.value = minQuantity.value
    statusMessage.value = ''
  },
)
const isOutOfStock = computed(
  () => availableStock.value <= 0,
)

const isLowStock = computed(
  () => availableStock.value > 0 && availableStock.value <= 10,
)

const hasDiscount = computed(() => props.product.discountPercentage > 0)

const discountedPrice = computed(
  () =>
    props.product.price *
    (1 - props.product.discountPercentage / 100),
)
const stockMessage = computed(() => {
  if (isOutOfStock.value) return 'Out of stock'

  if (isLowStock.value) {
    return `Only ${availableStock.value} left in stock — order soon.`
  }

  return `${availableStock.value} available`
})

const categoryLabel = computed(() =>
  props.product.category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
)

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)

const clampQuantity = () => {
  const parsed = Math.round(Number(quantity.value))

  quantity.value = Number.isFinite(parsed)
    ? Math.min(Math.max(parsed, minQuantity.value), maxQuantity.value)
    : minQuantity.value
}

watch(availableStock, (stock) => {
  if (stock <= 0) {
    quantity.value = 0
    return
  }

  clampQuantity()
})

const decreaseQuantity = () => {
  if (quantity.value > minQuantity.value) quantity.value -= 1
}

const increaseQuantity = () => {
  if (quantity.value < maxQuantity.value) quantity.value += 1
}

const addToCart = async () => {
  if (isOutOfStock.value) return

  clampQuantity()

  statusMessage.value = ''

  const result = cartStore.addItem(props.product, quantity.value)

  if (!result) {
    statusMessage.value =
      'Unable to add the requested quantity. Please check availability.'
    return
  }

  await nextTick()

  statusMessage.value =
    `Added ${quantity.value} × ${props.product.title} to your cart.`
}
</script>

<template>
  <div class="product-info">
    <div class="product-info__eyebrow">
      <p class="product-info__brand">
        {{ product.brand || 'FASCO' }}
      </p>

      <NuxtLink
        class="product-info__category"
        :to="{ path: '/products', query: { category: product.category } }"
      >
        {{ categoryLabel }}
      </NuxtLink>
    </div>

    <h1
      id="product-title"
      class="product-info__title"
      tabindex="-1"
      :data-product-id="product.id"
    >
      {{ product.title }}
    </h1>

    <p class="product-info__rating">
      <span class="product-info__stars" aria-hidden="true">★</span>
      Rated {{ product.rating.toFixed(1) }} out of 5
      <template v-if="product.reviews?.length">
        ({{ product.reviews.length }} reviews)
      </template>
    </p>

    <div class="product-info__price">
      <span class="product-info__current-price">
        {{ formatPrice(discountedPrice) }}
      </span>

      <template v-if="hasDiscount">
        <s class="product-info__original-price">
          {{ formatPrice(product.price) }}
        </s>

        <span class="product-info__discount">
          SAVE {{ Math.round(product.discountPercentage) }}%
        </span>
      </template>
    </div>

    <p
      class="product-info__stock"
      :class="{
        'is-low': isLowStock,
        'is-out': isOutOfStock,
      }"
    >
      <span class="product-info__stock-dot" aria-hidden="true" />
      {{ stockMessage }}
    </p>

    <section aria-labelledby="product-description-title">
      <h2 id="product-description-title" class="visually-hidden">
        Description
      </h2>

      <p class="product-info__description">
        {{ product.description }}
      </p>
    </section>

    <ul
      v-if="product.tags?.length"
      class="product-info__tags"
      aria-label="Product tags"
    >
      <li
        v-for="tag in product.tags"
        :key="tag"
        class="product-info__tag"
      >
        {{ tag }}
      </li>
    </ul>

    <dl class="product-info__facts">
      <template v-if="product.brand">
        <div>
          <dt>Brand</dt>
          <dd>{{ product.brand }}</dd>
        </div>
      </template>

      <template v-if="product.sku">
        <div>
          <dt>SKU</dt>
          <dd>{{ product.sku }}</dd>
        </div>
      </template>

      <div>
        <dt>Category</dt>
        <dd>{{ categoryLabel }}</dd>
      </div>

      <div>
        <dt>Availability</dt>
        <dd>{{ product.availabilityStatus ?? stockMessage }}</dd>
      </div>

      <template v-if="product.warrantyInformation">
        <div>
          <dt>Warranty</dt>
          <dd>{{ product.warrantyInformation }}</dd>
        </div>
      </template>

      <template v-if="product.shippingInformation">
        <div>
          <dt>Shipping</dt>
          <dd>{{ product.shippingInformation }}</dd>
        </div>
      </template>

      <template v-if="product.returnPolicy">
        <div>
          <dt>Returns</dt>
          <dd>{{ product.returnPolicy }}</dd>
        </div>
      </template>

      <template
        v-if="
          product.minimumOrderQuantity &&
            product.minimumOrderQuantity > 1
        "
      >
        <div>
          <dt>Minimum order</dt>
          <dd>{{ product.minimumOrderQuantity }} items</dd>
        </div>
      </template>
    </dl>

    <div class="product-info__actions">
      <div class="product-quantity" role="group" aria-labelledby="quantity-label">
        <span id="quantity-label" class="product-quantity__label">
          Qty
        </span>

        <button
          type="button"
          class="product-quantity__button"
          :disabled="quantity <= minQuantity"
          aria-label="Decrease quantity"
          @click="decreaseQuantity"
        >
          −
        </button>

        <input
          v-model.number="quantity"
          class="product-quantity__input"
          type="number"
          inputmode="numeric"
          :min="minQuantity"
          :max="maxQuantity"
          aria-labelledby="quantity-label"
          @change="clampQuantity"
          @blur="clampQuantity"
        />

        <button
          type="button"
          class="product-quantity__button"
          :disabled="quantity >= maxQuantity"
          aria-label="Increase quantity"
          @click="increaseQuantity"
        >
          +
        </button>
      </div>

      <button
        type="button"
        class="product-info__add"
        :disabled="isOutOfStock"
        @click="addToCart"
      >
        {{ isOutOfStock ? 'Out of Stock' : 'Add to Cart' }}
      </button>
    </div>

    <p
      v-if="statusMessage"
      class="product-info__status"
      role="status"
    >
      {{ statusMessage }}
    </p>
  </div>
</template>
