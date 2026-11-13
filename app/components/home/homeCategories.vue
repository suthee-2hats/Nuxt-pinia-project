<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import CategoryCarousel from "~/components/category/categoryCarousel.vue";
import CategoryGrid from "~/components/category/categoryGrid.vue";
import { useCategories } from "~/composables/useCategory";

const { categories, pending, error, fetchCategories } = useCategories();

const showAllCategories = ref(false);

// Fetch the complete category list.
onMounted(fetchCategories);

// All remaining categories are displayed in the grid.
const remainingCategories = computed(() => categories.value.slice(3));

// Show the button only when there are more categories to reveal.
const showMoreAvailable = computed(
  () => remainingCategories.value.length > 0 && !showAllCategories.value,
);

const showAll = () => {
  showAllCategories.value = true;
};
</script>

<template>
  <section class="home-categories">
    <div v-if="error && !pending" class="home-categories__error">
      <p role="alert">{{ error }}</p>

      <button type="button" @click="fetchCategories">Try again</button>
    </div>

    <template v-else-if="pending || categories.length">
      <CategoryCarousel
        :categories="categories"
        :show-more-available="showMoreAvailable"
        :loading="pending"
        @show-more="showAll"
      />

      <p v-if="pending" class="visually-hidden" role="status">
        Loading categories...
      </p>

      <CategoryGrid
        v-if="showAllCategories"
        :categories="remainingCategories"
      />
    </template>

    <p v-else class="home-categories__status" role="status">
      No categories are currently available.
    </p>
  </section>
</template>
