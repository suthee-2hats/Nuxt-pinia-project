
<script setup lang="ts">
import HomeHeroImage from './homeHeroImage.vue'

// LEFT IMAGE
import leftAvif1x from '~/assets/img/heroPage/hero-left-397.avif'
import leftAvif2x from '~/assets/img/heroPage/hero-left-794.avif'
import leftWebp1x from '~/assets/img/heroPage/hero-left-397.webp'
import leftWebp2x from '~/assets/img/heroPage/hero-left-794.webp'
import leftJpg1x from '~/assets/img/heroPage/hero-left-397.jpg'
import leftJpg2x from '~/assets/img/heroPage/hero-left-794.jpg'

// UPPER IMAGE
import topAvif1x from '~/assets/img/heroPage/hero-top-426.avif'
import topAvif2x from '~/assets/img/heroPage/hero-top-852.avif'
import topWebp1x from '~/assets/img/heroPage/hero-top-426.webp'
import topWebp2x from '~/assets/img/heroPage/hero-top-852.webp'
import topJpg1x from '~/assets/img/heroPage/hero-top-426.jpg'
import topJpg2x from '~/assets/img/heroPage/hero-top-852.jpg'

// LOWER IMAGE
import bottomAvif1x from '~/assets/img/heroPage/hero-bottom-426.avif'
import bottomAvif2x from '~/assets/img/heroPage/hero-bottom-852.avif'
import bottomWebp1x from '~/assets/img/heroPage/hero-bottom-426.webp'
import bottomWebp2x from '~/assets/img/heroPage/hero-bottom-852.webp'
import bottomJpg1x from '~/assets/img/heroPage/hero-bottom-426.jpg'
import bottomJpg2x from '~/assets/img/heroPage/hero-bottom-852.jpg'

// RIGHT IMAGE
import rightAvif1x from '~/assets/img/heroPage/hero-right-397.avif'
import rightAvif2x from '~/assets/img/heroPage/hero-right-794.avif'
import rightWebp1x from '~/assets/img/heroPage/hero-right-397.webp'
import rightWebp2x from '~/assets/img/heroPage/hero-right-794.webp'
import rightJpg1x from '~/assets/img/heroPage/hero-right-397.jpg'
import rightJpg2x from '~/assets/img/heroPage/hero-right-794.jpg'

interface HeroImage {
  to: string
  alt: string
  avifSrcset: string
  webpSrcset: string
  fallbackSrc: string
  fallbackSrcset: string
  sizes: string
  width: number
  height: number
  variant: 'side' | 'middle'
  loading?: 'eager' | 'lazy'
}

const leftImage: HeroImage = {
  to: '/products',
  alt: 'Discover our menswear collection',
  avifSrcset: `${leftAvif1x} 397w, ${leftAvif2x} 794w`,
  webpSrcset: `${leftWebp1x} 397w, ${leftWebp2x} 794w`,
  fallbackSrc: leftJpg1x,
  fallbackSrcset: `${leftJpg1x} 397w, ${leftJpg2x} 794w`,
  sizes: '(max-width: 767px) 45vw, 397px',
  width: 397,
  height: 756,
  variant: 'side',
  loading: 'eager',
}

const upperImage: HeroImage = {
  to: '/products',
  alt: 'Discover our latest fashion collection',
  avifSrcset: `${topAvif1x} 426w, ${topAvif2x} 852w`,
  webpSrcset: `${topWebp1x} 426w, ${topWebp2x} 852w`,
  fallbackSrc: topJpg1x,
  fallbackSrcset: `${topJpg1x} 426w, ${topJpg2x} 852w`,
  sizes: '(max-width: 767px) 100vw, 426px',
  width: 426,
  height: 150,
  variant: 'middle',
  loading: 'eager',
}

const lowerImage: HeroImage = {
  to: '/products',
  alt: 'Explore our latest fashion collection',
  avifSrcset: `${bottomAvif1x} 426w, ${bottomAvif2x} 852w`,
  webpSrcset: `${bottomWebp1x} 426w, ${bottomWebp2x} 852w`,
  fallbackSrc: bottomJpg1x,
  fallbackSrcset: `${bottomJpg1x} 426w, ${bottomJpg2x} 852w`,
  sizes: '(max-width: 767px) 100vw, 426px',
  width: 426,
  height: 150,
  variant: 'middle',
}

const rightImage: HeroImage = {
  to: '/products',
  alt: 'Discover our menswear collection',
  avifSrcset: `${rightAvif1x} 397w, ${rightAvif2x} 794w`,
  webpSrcset: `${rightWebp1x} 397w, ${rightWebp2x} 794w`,
  fallbackSrc: rightJpg1x,
  fallbackSrcset: `${rightJpg1x} 397w, ${rightJpg2x} 794w`,
  sizes: '(max-width: 767px) 45vw, 397px',
  width: 397,
  height: 756,
  variant: 'side',
}
</script>
<template>
    <section
      class="home-hero container-global1"
      aria-labelledby="home-hero-title"
    >
      <!-- Left promotional image -->
      <HomeHeroImage :image="leftImage" />
  
      <!-- Middle column -->
      <div class="home-hero__middle">
  
        <!-- Upper promotional image -->
        <HomeHeroImage :image="upperImage" />
  
        <!-- Central sale content -->
        <div class="home-hero__content">
          <h1
            id="home-hero-title"
            class="home-hero__title"
          >
            <span class="home-hero__title-top">
              Ultimate
            </span>
  
            <span class="home-hero__title-sale">
              Sale
            </span>
          </h1>
  
          <p class="home-hero__subtitle">
            New collection
          </p>
  
          <NuxtLink
            to="/products"
            class="home-hero__cta"
          >
            Shop now
          </NuxtLink>
        </div>
  
        <!-- Lower promotional image -->
        <HomeHeroImage :image="lowerImage" />
  
      </div>
  
      <!-- Right promotional image -->
      <HomeHeroImage :image="rightImage" />
  
    </section>
  </template>