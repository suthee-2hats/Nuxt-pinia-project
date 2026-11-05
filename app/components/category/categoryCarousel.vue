<script setup lang="ts">
defineProps<{
  carouselItems: any[]
}>()
</script>

<template>
  <div class="carousel-section">
    <!-- Heading and Buttons -->
    <div class="carousel-header">
      <div class="text-content">
        <h2>EXPLORE OUR DIVERSE CATEGORIES</h2>
        <p>Discover curated collections from everyday essentials to statement pieces.</p>
      </div>
      <div class="nav-buttons">
        <button class="nav-btn">&lt;</button>
        <button class="nav-btn">&gt;</button>
      </div>
    </div>

    <!-- Carousel Images -->
    <div class="carousel-track">
      <div 
        v-for="(item, index) in carouselItems" 
        :key="item.slug"
        :class="['carousel-item', { 'first-big-image': index === 0 }]"
      >
        <img :src="item.image" :alt="item.name" />
        <div class="label">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-section { display: flex; gap: 2rem; margin-bottom: 3rem; }
.carousel-header { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.carousel-track { flex: 2; display: flex; gap: 1rem; overflow-x: auto; }
.carousel-item { flex: 0 0 auto; position: relative; border-radius: 8px; overflow: hidden; }
.carousel-item img { width: 200px; height: 300px; object-fit: cover; }
.first-big-image img { width: 300px; height: 400px; } /* Makes the first image larger */
.label { position: absolute; bottom: 10px; width: 100%; text-align: center; background: white; padding: 5px; }
</style>