
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CategoryCarousel from '~/components/category/categoryCarousel.vue'
import CategoryGrid from '~/components/category/categoryGrid.vue'
import { useCategories } from '~/composables/useCategory'

const { categories, pending, error, fetchCategories } = useCategories()

const showAllCategories = ref(false)

// Fetch the complete category list.
onMounted(fetchCategories)

// First three categories are featured.
const featuredCategories = computed(() => categories.value.slice(0, 3))

// All remaining categories are displayed in the grid.
const remainingCategories = computed(() => categories.value.slice(3))

// Show the button only when there are more categories to reveal.
const showMoreAvailable = computed(
  () => remainingCategories.value.length > 0 && !showAllCategories.value,
)

const showAll = () => {
  showAllCategories.value = true
}
</script>

<template>
  <section class="home-categories">
    <p v-if="pending" class="home-categories__status" role="status">
      Loading categories...
    </p>

    <div v-else-if="error" class="home-categories__error">
      <p role="alert">{{ error }}</p>

      <button type="button" @click="fetchCategories">
        Try again
      </button>
    </div>

    <template v-else-if="categories.length">
        <CategoryCarousel
        :categories="categories"
        :show-more-available="showMoreAvailable"
        @show-more="showAll"
      />

      <CategoryGrid
        v-if="showAllCategories"
        :categories="remainingCategories"
      />
    </template>

    <p
      v-else
      class="home-categories__status"
      role="status"
    >
      No categories are currently available.
    </p>
  </section>
</template>
