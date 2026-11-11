<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import CartItem from '~/components/cart/Cartitem.vue'

const cartStore = useCartStore()

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
</script>

<template>
  <div class="cart-page">
    <div class="cart-page__container">
      <header class="cart-page__header">
        <h1 class="cart-page__title">Shopping Cart</h1>

        <nav class="cart-page__breadcrumb" aria-label="Breadcrumb">
          <NuxtLink to="/">Home</NuxtLink>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Your Shopping Cart</span>
        </nav>
      </header>

      <div v-if="cartStore.isEmpty" class="cart-page__empty">
        <p>Your cart is empty.</p>
        <NuxtLink to="/products">Continue Shopping</NuxtLink>
      </div>

      <section v-else class="cart-page__content" aria-label="Shopping cart items">
        <div class="cart-page__table">
          <div class="cart-page__table-header" aria-hidden="true">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          <div class="cart-page__items">
            <CartItem
              v-for="item in cartStore.items"
              :key="item.productId"
              :item="item"
            />
          </div>
        </div>

        <div class="cart-page__footer">
          <div class="cart-page__summary">
            <p class="cart-page__subtotal">
              <span>Subtotal</span>
              <span>{{ formatPrice(cartStore.subtotal) }}</span>
            </p>

            <p class="cart-page__note">
              Shipping and taxes are calculated at checkout.
            </p>
          </div>

          <NuxtLink
            v-if="!cartStore.isEmpty"
            to="/checkout"
            class="cart-page__checkout-button"
          >
            Proceed to Checkout
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
