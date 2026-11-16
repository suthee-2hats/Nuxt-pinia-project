
<script setup lang="ts">
import type { ProductFilters } from "~/types/product";

const props = defineProps<{
  modelValue: ProductFilters;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: ProductFilters];
}>();

const hasActiveFilters = computed(() => {
  return (
    props.modelValue.minPrice !== null ||
    props.modelValue.maxPrice !== null ||
    props.modelValue.brand !== "" ||
    props.modelValue.rating !== null
  );
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

const updateFilter = (changes: Partial<ProductFilters>) => {
  emit("update:modelValue", {
    ...props.modelValue,
    ...changes,
  });
};

const clearAllFilters = () => {
  updateFilter({
    minPrice: null,
    maxPrice: null,
    brand: "",
    rating: null,
  });
};
</script>

<template>
  <section
    class="applied-filters"
    aria-label="Applied filters"
    aria-live="polite"
  >
    <div class="applied-filters__header">
      <h2 class="applied-filters__title">
        Applied Filters
      </h2>

      <button
        v-if="hasActiveFilters"
        type="button"
        class="applied-filters__clear"
        @click="clearAllFilters"
      >
        Clear all
      </button>
    </div>

    <div v-if="hasActiveFilters" class="applied-filters__list">
      <button
        v-if="modelValue.minPrice !== null"
        type="button"
        class="applied-filters__chip"
        :aria-label="`Remove minimum price ${formatPrice(modelValue.minPrice)}`"
        @click="updateFilter({ minPrice: null })"
      >
        Min: {{ formatPrice(modelValue.minPrice) }}
        <span aria-hidden="true">×</span>
      </button>

      <button
        v-if="modelValue.maxPrice !== null"
        type="button"
        class="applied-filters__chip"
        :aria-label="`Remove maximum price ${formatPrice(modelValue.maxPrice)}`"
        @click="updateFilter({ maxPrice: null })"
      >
        Max: {{ formatPrice(modelValue.maxPrice) }}
        <span aria-hidden="true">×</span>
      </button>

      <button
        v-if="modelValue.brand"
        type="button"
        class="applied-filters__chip"
        :aria-label="`Remove ${modelValue.brand} brand filter`"
        @click="updateFilter({ brand: '' })"
      >
        {{ modelValue.brand }}
        <span aria-hidden="true">×</span>
      </button>

      <button
        v-if="modelValue.rating !== null"
        type="button"
        class="applied-filters__chip"
        :aria-label="`Remove ${modelValue.rating} stars rating filter`"
        @click="updateFilter({ rating: null })"
      >
        {{ modelValue.rating }}+ Stars
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <p v-else class="applied-filters__empty">
      No filters applied
    </p>
  </section>
</template>
