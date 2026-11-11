<script setup lang="ts">
import { onMounted } from 'vue'
import type { Order } from '~/types/order'
import { readLastOrder } from '~/utils/orderStorage'

const lastOrder = useState<Order | null>('last-order', () => null)

onMounted(() => {
  if (lastOrder.value) return

  const stored = readLastOrder()

  if (stored) {
    lastOrder.value = stored
  }
})

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

useSeoMeta({
  title: 'Order Confirmed | FASCO',
})
</script>

<template>
  <div class="checkout-page">
    <div class="checkout-page__container">
      <div class="checkout-success" role="status">
        <p class="checkout-success__icon" aria-hidden="true">✓</p>

        <h1 class="checkout-success__title">Thank you for your order</h1>

        <template v-if="lastOrder">
          <p class="checkout-success__lead">
            Order <strong>{{ lastOrder.id }}</strong> was placed on
            {{ formatDate(lastOrder.createdAt) }}.
          </p>

          <dl class="checkout-success__details">
            <div>
              <dt>Items</dt>
              <dd>
                {{
                  lastOrder.items.reduce(
                    (count, item) => count + item.quantity,
                    0,
                  )
                }}
              </dd>
            </div>

            <div>
              <dt>Total</dt>
              <dd>{{ formatPrice(lastOrder.total) }}</dd>
            </div>

            <div>
              <dt>Shipping to</dt>
              <dd>
                {{ lastOrder.customer.firstName }}
                {{ lastOrder.customer.lastName }},
                {{ lastOrder.customer.address }},
                {{ lastOrder.customer.city }}
                {{ lastOrder.customer.postalCode }},
                {{ lastOrder.customer.country }}
              </dd>
            </div>
          </dl>

          <p class="checkout-success__note">
            A confirmation would normally be sent to
            <strong>{{ lastOrder.customer.email }}</strong>.
          </p>
        </template>

        <p v-else class="checkout-success__lead">
          No recent order details were found. If you just completed a
          purchase, check your email for the confirmation.
        </p>

        <NuxtLink to="/products" class="checkout-success__link">
          Back to Shopping
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
