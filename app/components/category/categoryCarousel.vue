
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { Category } from '~/types/category'

const props = defineProps<{
  categories: Category[]
  showMoreAvailable: boolean
}>()

const emit = defineEmits<{
  (event: 'show-more'): void
}>()

// Number of cards visible at the same time
const visibleCount = 3

// Index of the first visible category
const currentIndex = ref(0)

// Pause automatic rotation when the user interacts
const isHovered = ref(false)
const isFocused = ref(false)

// Automatically calculate the three visible categories
const visibleCategories = computed<Category[]>(() => {
  const total = props.categories.length

  if (total <= visibleCount) {
    return props.categories
  }

  const result: Category[] = []

  for (let index = 0; index < visibleCount; index++) {
    const categoryIndex = (currentIndex.value + index) % total
    const category = props.categories[categoryIndex]

    if (category) {
      result.push(category)
    }
  }

  return result
})
// Move to the next category
const nextSlide = () => {
  const total = props.categories.length

  if (total <= visibleCount) return

  currentIndex.value = (currentIndex.value + 1) % total
}

// Move to the previous category
const previousSlide = () => {
  const total = props.categories.length

  if (total <= visibleCount) return

  currentIndex.value = (currentIndex.value - 1 + total) % total
}

// Check whether keyboard focus has left the carousel
const handleFocusOut = (event: FocusEvent) => {
  const nextTarget = event.relatedTarget as Node | null

  if (!event.currentTarget || !nextTarget) {
    isFocused.value = false
    return
  }

  isFocused.value = (event.currentTarget as HTMLElement).contains(nextTarget)
}

// Automatically change the category every 5 seconds
let autoplayInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  autoplayInterval = setInterval(() => {
    if (
      props.categories.length > visibleCount &&
      !isHovered.value &&
      !isFocused.value
    ) {
      nextSlide()
    }
  }, 5000)
})

// Clean up the timer when the component is removed
onUnmounted(() => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
  }
})
</script>

<template>
  <section
    class="category-carousel"
    aria-labelledby="category-carousel-title"
    aria-roledescription="carousel"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @focusin="isFocused = true"
    @focusout="handleFocusOut"
  >
    <div class="category-carousel__content">
      <h2
        id="category-carousel-title"
        class="category-carousel__title"
      >
        Explore Our Categories
      </h2>

      <p class="category-carousel__description">
        Discover curated collections, from everyday essentials
        to statement pieces.
      </p>
         <!-- Carousel navigation -->
    <div
    v-if="categories.length > visibleCount"
    class="category-carousel__controls"
  >
    <button
      type="button"
      class="category-carousel__arrow"
      aria-label="Previous categories"
      @click="previousSlide"
    >
      &lsaquo;
    </button>

    <button
      type="button"
      class="category-carousel__arrow"
      aria-label="Next categories"
      @click="nextSlide"
    >
      &rsaquo;
    </button>
  </div>
     
    </div>

    <div class="category-carousel__images">
      <NuxtLink
        v-for="(category, index) in visibleCategories"
        :key="category.slug"
        :to="`/products?category=${encodeURIComponent(category.slug)}`"
        class="category-carousel__card"
        :class="`category-carousel__card--${index + 1}`"
      >
        <img
          :src="category.image"
          alt=""
          loading="lazy"
          decoding="async"
        />

        <span class="category-carousel__label">
          {{ category.name }}
        </span>
      </NuxtLink>
    </div>
    <button
    v-if="showMoreAvailable"
    type="button"
    class="category-carousel__button"
    @click="emit('show-more')"
  >
    Explore all categories
  </button>


  </section>
</template>
