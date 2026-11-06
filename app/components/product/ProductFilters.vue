<script setup lang="ts">
import type { ProductFilters } from '~/types/product'

defineProps<{
  modelValue: ProductFilters
  brands: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProductFilters]
}>()

const updateFilter = (
  key: keyof ProductFilters,
  value: string | number | null,
  current: ProductFilters,
) => {
  emit('update:modelValue', {
    ...current,
    [key]: value,
  })
}
</script>

<template>
  <aside
    class="product-filters"
    aria-labelledby="product-filters-title"
  >
    <h2 id="product-filters-title">
      Filters
    </h2>

    <fieldset>
      <legend>Price range</legend>

      <label>
        Minimum price
        <input
          type="number"
          min="0"
          :value="modelValue.minPrice ?? ''"
          @change="updateFilter(
            'minPrice',
            ($event.target as HTMLInputElement).value
              ? Number(($event.target as HTMLInputElement).value)
              : null,
            modelValue
          )"
        />
      </label>

      <label>
        Maximum price
        <input
          type="number"
          min="0"
          :value="modelValue.maxPrice ?? ''"
          @change="updateFilter(
            'maxPrice',
            ($event.target as HTMLInputElement).value
              ? Number(($event.target as HTMLInputElement).value)
              : null,
            modelValue
          )"
        />
      </label>
    </fieldset>

    <fieldset>
      <legend>Brand</legend>

      <label>
        <select
          :value="modelValue.brand"
          @change="updateFilter(
            'brand',
            ($event.target as HTMLSelectElement).value,
            modelValue
          )"
        >
          <option value="">All brands</option>

          <option
            v-for="brand in brands"
            :key="brand"
            :value="brand"
          >
            {{ brand }}
          </option>
        </select>
      </label>
    </fieldset>
  </aside>
</template>