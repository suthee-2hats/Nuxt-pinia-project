<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import type { ProductFilters } from '~/types/product'

const props = withDefaults(
  defineProps<{
    modelValue: ProductFilters
    brands: string[]
    minPriceLimit?: number
    maxPriceLimit?: number
  }>(),
  {
    minPriceLimit: 0,
    maxPriceLimit: 2000,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: ProductFilters]
}>()

const brandsOpen = ref(false)
const brandsListId = useId()

const ratingOptions = [
  { label: '4.5+ stars', value: 4.5 },
  { label: '4+ stars', value: 4 },
  { label: '3+ stars', value: 3 },
]

const selectedMin = computed(
  () => props.modelValue.minPrice ?? props.minPriceLimit,
)

const selectedMax = computed(
  () => props.modelValue.maxPrice ?? props.maxPriceLimit,
)

const rangeTrackStyle = computed(() => {
  const range = props.maxPriceLimit - props.minPriceLimit

  const start = ((selectedMin.value - props.minPriceLimit) / range) * 100
  const end = ((selectedMax.value - props.minPriceLimit) / range) * 100

  return {
    background: `linear-gradient(
      to right,
      #dedede ${start}%,
      #1749e8 ${start}%,
      #1749e8 ${end}%,
      #dedede ${end}%
    )`,
  }
})

const formatPrice = (price: number) =>
  `$${price.toLocaleString('en-US')}`

const updateFilter = (
  key: keyof ProductFilters,
  value: string | number | null,
) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value,
  })
}

const updateMinPrice = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  const min = Math.min(value, selectedMax.value)

  updateFilter(
    'minPrice',
    min === props.minPriceLimit ? null : min,
  )
}

const updateMaxPrice = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  const max = Math.max(value, selectedMin.value)

  updateFilter(
    'maxPrice',
    max === props.maxPriceLimit ? null : max,
  )
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

    <!-- Price range -->
    <fieldset class="product-filters__section">
      <legend>Price</legend>

      <div class="price-range">
        <div class="price-range__values">
          <span>{{ formatPrice(selectedMin) }}</span>
          <span>{{ formatPrice(selectedMax) }}</span>
        </div>

        <div
          class="price-range__controls"
          :style="rangeTrackStyle"
        >
          <input
            type="range"
            :min="minPriceLimit"
            :max="maxPriceLimit"
            :value="selectedMin"
            aria-label="Minimum price"
            @input="updateMinPrice"
          />

          <input
            type="range"
            :min="minPriceLimit"
            :max="maxPriceLimit"
            :value="selectedMax"
            aria-label="Maximum price"
            @input="updateMaxPrice"
          />
        </div>
      </div>
    </fieldset>
    <!-- Rating filter -->
    <fieldset class="product-filters__section">
      <legend>Rating</legend>

      <label class="product-filters__rating-option">
        <input
          type="radio"
          name="product-rating"
          :checked="modelValue.rating === null"
          @change="updateFilter('rating', null)"
        />
        <span>All ratings</span>
      </label>

      <label
        v-for="option in ratingOptions"
        :key="option.value"
        class="product-filters__rating-option"
      >
        <input
          type="radio"
          name="product-rating"
          :value="option.value"
          :checked="modelValue.rating === option.value"
          @change="updateFilter('rating', option.value)"
        />

        <span>
          {{ option.label }}
          <span aria-hidden="true">★</span>
        </span>
      </label>
    </fieldset>
    
    <!-- Brand filter -->
    <section class="product-filters__section">
      <h3>
        <button
          class="product-filters__toggle"
          type="button"
          :aria-expanded="brandsOpen"
          :aria-controls="brandsListId"
          @click="brandsOpen = !brandsOpen"
        >
          <span>Brands</span>

          <svg
            class="product-filters__arrow"
            :class="{ 'is-open': brandsOpen }"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="m7 10 5 5 5-5" />
          </svg>
        </button>
      </h3>

      <ul
        v-if="brandsOpen"
        :id="brandsListId"
        class="product-filters__brand-list"
      >
        <li>
          <button
            type="button"
            :aria-pressed="!modelValue.brand"
            :class="{ 'is-active': !modelValue.brand }"
            @click="updateFilter('brand', '')"
          >
            All brands
          </button>
        </li>

        <li
          v-for="brand in brands"
          :key="brand"
        >
          <button
            type="button"
            :aria-pressed="modelValue.brand === brand"
            :class="{ 'is-active': modelValue.brand === brand }"
            @click="updateFilter('brand', brand)"
          >
            {{ brand }}
          </button>
        </li>
      </ul>
    </section>


  </aside>
</template>