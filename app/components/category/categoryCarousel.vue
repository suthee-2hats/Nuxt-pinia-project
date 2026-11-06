
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

// Number of categories displayed at the same time
const visibleCount = 3

// Index of the first visible category
const currentIndex = ref(0)

// Pause autoplay while the user interacts
const isHovered = ref(false)
const isFocused = ref(false)

// Calculate the three visible categories
const visibleCategories = computed<Category[]>(() => {
  const total = props.categories.length

  // If there are three or fewer categories, display all of them
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

// Detect when keyboard focus leaves the carousel
const handleFocusOut = (event: FocusEvent) => {
  const nextTarget = event.relatedTarget as Node | null

  isFocused.value =
    nextTarget !== null &&
    (event.currentTarget as HTMLElement).contains(nextTarget)
}

// Automatic carousel rotation
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
  }, 3000)
})

// Clean up the timer
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
    <!-- Left content -->
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

      <button
        v-if="showMoreAvailable"
        type="button"
        class="category-carousel__button"
        @click="emit('show-more')"
      >
        Explore all categories
      </button>
    </div>

    <!-- Three featured category cards -->
    <Transition name="category-slide" mode="out-in">
      <div
        :key="currentIndex"
        class="category-carousel__images"
      >
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
    </Transition>

    <!-- Navigation controls: directly below the images -->
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
  </section>
</template>
