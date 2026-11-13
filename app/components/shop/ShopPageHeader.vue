<script setup lang="ts">
defineProps<{
  selectedCategory: string;
}>();
</script>

<template>
  <section class="shop-page-header">
    <h1 class="shop-page-header__title">Shop</h1>

    <nav aria-label="Breadcrumb">
      <ol class="shop-page-header__breadcrumb">
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>

        <li>
          <NuxtLink to="/products">Shop</NuxtLink>
        </li>

        <li aria-current="page">
          {{ selectedCategory || "All Products" }}
        </li>
      </ol>
    </nav>
  </section>
</template>
