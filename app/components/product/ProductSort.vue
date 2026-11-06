<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="product-sort">
    <label for="product-sort-select">
      Sort by
    </label>

    <select
      id="product-sort-select"
      :value="modelValue"
      @change="emit(
        'update:modelValue',
        ($event.target as HTMLSelectElement).value
      )"
    >
      <option value="default">Default</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating-desc">Highest Rated</option>
    </select>
  </div>
</template>