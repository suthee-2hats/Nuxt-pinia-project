
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

<style lang="scss" scoped>

.applied-filters {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 0;
    margin-bottom: 8px;
    border-bottom: 1px solid #eee;
  
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
  
    &__title {
      margin: 0;
      color: #333;
      font-size: 14px;
      font-weight: 600;
    }
  
    &__list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }
  
    &__chip {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      min-height: 32px;
      padding: 5px 10px;
      border: 1px solid #e5ded8;
      border-radius: 20px;
      background: transparent;
      color: #38312d;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      transition:
        background-color 180ms ease,
        border-color 180ms ease;
  
      span {
        color: #777;
        font-size: 17px;
        line-height: 1;
      }
  
      &:hover {
        border-color: #b9a99e;
        background: #f0ebe7;
      }
  
      &:focus-visible {
        outline: 2px solid #2463eb;
        outline-offset: 3px;
      }
    }
  
    &__clear {
      padding: 4px 0;
      border: 0;
      background: transparent;
      color: $color-faint;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
  
      &:hover {
        color: $color-ink-strong;
        text-decoration: underline;
      }
  
      &:focus-visible {
        outline: 2px solid #2463eb;
        outline-offset: 3px;
      }
    }
  
    &__empty {
      margin: 0;
      color: #999;
      font-size: 12px;
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .applied-filters__chip {
      transition: none;
    }
  }
  
</style>
