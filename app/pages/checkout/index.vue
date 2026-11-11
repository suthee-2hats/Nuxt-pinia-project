<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useFormValidation } from '~/composables/useFormValidation'
import { orderService } from '~/services/orderServices'
import { saveLastOrder } from '~/utils/orderStorage'
import type { CheckoutFormData, Order } from '~/types/order'

import AddressForm from '~/components/checkout/AddressForm.vue'
import ShippingOptions from '~/components/checkout/ShippingOptions.vue'
import OrderSummary from '~/components/checkout/OrderSummary.vue'

const cartStore = useCartStore()

const { errors, validateCheckout, clearError } = useFormValidation()

const lastOrder = useState<Order | null>('last-order', () => null)

const form = ref<CheckoutFormData>({
  email: '',
  country: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postalCode: '',
  saveInformation: false,
  shippingMethod: 'standard',
  paymentMethod: 'card',
})

const SHIPPING_COSTS = {
  standard: 5,
  express: 15,
} as const

const shippingCost = computed(
  () => SHIPPING_COSTS[form.value.shippingMethod],
)

const isSubmitting = ref(false)
const submitError = ref('')

const hasErrors = computed(() => Object.keys(errors.value).length > 0)

const focusFirstInvalidField = async () => {
  await nextTick()

  document
    .querySelector<HTMLElement>('[aria-invalid="true"]')
    ?.focus()
}

const handleCheckout = async () => {
  if (isSubmitting.value) return

  const isValid = validateCheckout(form.value)

  if (!isValid) {
    await focusFirstInvalidField()
    return
  }

  if (cartStore.isEmpty) {
    await navigateTo('/cart')
    return
  }

  isSubmitting.value = true
  submitError.value = ''

  try {
    const createdCart = await orderService.createOrder({
      userId: 1,
      products: cartStore.items.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
      })),
    })

    const order: Order = {
      id: `FS-${createdCart.id}`,
      items: cartStore.items.map((item) => ({ ...item })),
      customer: { ...form.value },
      subtotal: cartStore.subtotal,
      shipping: shippingCost.value,
      total: cartStore.subtotal + shippingCost.value,
      status: 'placed',
      createdAt: new Date().toISOString(),
    }

    lastOrder.value = order
    saveLastOrder(order)

    // Clear the cart only after the order has been created.
    cartStore.clearCart()

    await navigateTo('/checkout/success')
  } catch {
    submitError.value =
      'We could not place your order. Please check your connection and try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="checkout-page">
    <div class="checkout-page__container">
      <header class="checkout-page__header">
        <h1 class="checkout-page__title">Checkout</h1>

        <nav class="checkout-page__breadcrumb" aria-label="Breadcrumb">
          <NuxtLink to="/">Home</NuxtLink>
          <span aria-hidden="true">›</span>
          <NuxtLink to="/cart">Cart</NuxtLink>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Checkout</span>
        </nav>
      </header>

      <div v-if="cartStore.isEmpty" class="checkout-page__empty">
        <p>Your cart is empty.</p>

        <NuxtLink to="/products">Continue Shopping</NuxtLink>
      </div>

      <form
        v-else
        class="checkout-page__content"
        novalidate
        :aria-busy="isSubmitting"
        @submit.prevent="handleCheckout"
      >
        <div class="checkout-page__details">
          <p
            v-if="hasErrors"
            class="checkout-page__error-summary"
            role="alert"
          >
            Please correct the highlighted fields below.
          </p>

          <AddressForm
            v-model="form"
            :errors="errors"
            @clear-error="clearError"
          />

          <ShippingOptions v-model="form.shippingMethod" />
        </div>

        <div class="checkout-page__summary">
          <OrderSummary
            :items="cartStore.items"
            :shipping-cost="shippingCost"
          />

          <p
            v-if="submitError"
            class="checkout-page__submit-error"
            role="alert"
          >
            {{ submitError }}
          </p>

          <button
            type="submit"
            class="checkout-page__submit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Processing…' : 'Place Order' }}
          </button>

          <p class="checkout-page__secure-note">
            Secure demo checkout — no payment is taken.
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
