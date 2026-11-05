<script setup lang="ts">
defineProps<{
  gridItems: any[]
}>()
</script>

<template>
  <div class="category-section">
    <!-- Grid showing categories -->
    <div class="grid-container">
      <div v-for="item in gridItems" :key="item.slug" class="grid-card">
        <img :src="item.image" :alt="item.name" />
        <p>{{ item.name }}</p>
      </div>
    </div>

    <!-- Show More Button -->
    <div class="button-wrapper">
      <button class="show-more-btn">SHOW MORE</button>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 columns like the image */
  gap: 1rem;
}
.grid-card {
  background: white;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.grid-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}
.button-wrapper {
  text-align: center;
  margin-top: 2rem;
}
.show-more-btn {
  padding: 10px 30px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background: #f8ede3;
  cursor: pointer;
}
</style>