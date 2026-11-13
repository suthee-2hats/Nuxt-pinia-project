<script setup lang="ts">
import type { Category } from "~/types/category";

defineProps<{
  categories: Category[];
}>();
</script>

<template>
  <section
    v-if="categories.length"
    class="category-grid"
    aria-labelledby="category-grid-title"
  >
    <h2 id="category-grid-title" class="category-grid__title">
      All Categories
    </h2>

    <div class="category-grid__items">
      <NuxtLink
        v-for="category in categories"
        :key="category.slug"
        :to="`/products?category=${encodeURIComponent(category.slug)}`"
        class="category-grid__card"
      >
        <img :src="category.image" alt="" loading="lazy" decoding="async" >

        <span class="category-grid__name">
          {{ category.name }}
        </span>
      </NuxtLink>
    </div>
  </section>
</template>
