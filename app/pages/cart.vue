<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import CartItem from '../components/cart/Cartitem.vue'
const cartStore = useCartStore()
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

      <div v-if="cartStore.items.length === 0" class="cart-page__empty">
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
      </section>
    </div>
  </div>
</template>
