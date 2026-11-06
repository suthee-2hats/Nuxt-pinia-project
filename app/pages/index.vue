<script setup lang="ts">
import HomeHero from '~/components/home/homeHero.vue'
import HomeCategories from '~/components/home/homeCategories.vue'
import newsLetterSection from '~/components/home/newsLetterSection.vue';
</script>

<template>
  <div class="home-page">
    <HomeHero />

    <HomeCategories />
  </div>
  <div class="news-letter">
<newsLetterSection/>
  </div>
</template>