<script setup>
import AppHeader from "~/components/layout/AppHeader.vue";
</script>

<template>
  <div class="app-layout">
    <AppHeader />

    <main id="main-content">
      <slot />
    </main>
  </div>
</template>
