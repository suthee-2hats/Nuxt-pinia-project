<script setup lang="ts">
import type { Category } from '~/types/category'

defineProps<{
  categories: Category[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <nav
    class="shop-category-nav"
    aria-label="Product categories"
  >
    <button
      type="button"
      :aria-pressed="modelValue === ''"
      :class="{ 'is-active': modelValue === '' }"
      @click="emit('update:modelValue', '')"
    >
      All Products
    </button>

    <button
      v-for="category in categories"
      :key="category.slug"
      type="button"
      :aria-pressed="modelValue === category.slug"
      :class="{ 'is-active': modelValue === category.slug }"
      @click="emit('update:modelValue', category.slug)"
    >
      {{ category.name }}
    </button>
  </nav>
</template>