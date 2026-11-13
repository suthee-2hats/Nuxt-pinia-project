<script setup lang="ts">
interface HeroImage {
  to: string;
  alt: string;
  avifSrcset: string;
  webpSrcset: string;
  fallbackSrc: string;
  fallbackSrcset: string;
  sizes: string;
  width: number;
  height: number;
  variant: "side" | "middle";
  loading?: "eager" | "lazy";
}

// Declare the image prop
defineProps<{
  image: HeroImage;
}>();
</script>

<template>
  <NuxtLink
    :to="image.to"
    class="home-hero__image-link"
    :class="`home-hero__image-link--${image.variant}`"
  >
    <picture>
      <source
        type="image/avif"
        :srcset="image.avifSrcset"
        :sizes="image.sizes"
      >

      <source
        type="image/webp"
        :srcset="image.webpSrcset"
        :sizes="image.sizes"
      >

      <img
        :src="image.fallbackSrc"
        :srcset="image.fallbackSrcset"
        :sizes="image.sizes"
        :alt="image.alt"
        :width="image.width"
        :height="image.height"
        :loading="image.loading || 'lazy'"
        decoding="async"
      >
    </picture>
  </NuxtLink>
</template>
