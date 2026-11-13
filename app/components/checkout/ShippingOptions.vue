<script setup lang="ts">
import type { ShippingMethod, ShippingOption } from "~/types/order";

defineProps<{
  modelValue: ShippingMethod;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: ShippingMethod];
}>();

const shippingOptions: ShippingOption[] = [
  {
    id: "standard",
    label: "Standard Shipping",
    description: "Delivery in 5–7 business days",
    price: 5,
  },
  {
    id: "express",
    label: "Express Shipping",
    description: "Delivery in 1–2 business days",
    price: 15,
  },
];
</script>

<template>
  <fieldset class="shipping-options">
    <legend class="shipping-options__title">Shipping method</legend>

    <label
      v-for="option in shippingOptions"
      :key="option.id"
      class="shipping-options__option"
      :class="{
        'shipping-options__option--selected': modelValue === option.id,
      }"
    >
      <input
        type="radio"
        name="shipping-method"
        :value="option.id"
        :checked="modelValue === option.id"
        @change="emit('update:modelValue', option.id)"
      >

      <span class="shipping-options__details">
        <strong>{{ option.label }}</strong>
        <small>{{ option.description }}</small>
      </span>

      <span class="shipping-options__price">
        {{ option.price === 0 ? "Free" : `$${option.price.toFixed(2)}` }}
      </span>
    </label>
  </fieldset>
</template>
