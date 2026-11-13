<script setup lang="ts">
import HomeHero from "~/components/home/homeHero.vue";
import HomeCategories from "~/components/home/homeCategories.vue";
import newsLetterSection from "~/components/home/newsLetterSection.vue";
import AppFoooter from "~/components/layout/AppFoooter.vue";

usePageSeo({
  title: "FASCO | Modern Fashion, Clothing & Accessories",
  absoluteTitle: true,
  description:
    "Shop FASCO for modern clothing, shoes and accessories. Explore curated collections, new arrivals and timeless everyday essentials with simple, secure checkout.",
});
</script>

<template>
  <div class="home-page">
    <HomeHero />

    <HomeCategories />
  </div>
  <div class="news-letter">
    <newsLetterSection />
  </div>
  <AppFoooter />
</template>
