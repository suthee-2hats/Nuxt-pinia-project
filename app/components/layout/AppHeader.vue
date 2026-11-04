
<script setup lang="ts">
import { ref } from 'vue'

// Navigation item structure
interface NavItem {
  label: string
  path: string
}

// Navigation data
const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Products', path: '/products' },
]

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Toggle mobile navigation
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile navigation
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__container container-global1">
         <!-- Brand logo -->
      <div class="site-header__container_left">
        <NuxtLink
        to="/"
        class="site-header__logo"
        aria-label="FASCO homepage"
        @click="closeMobileMenu"
      >
        <img src="/img/logo/logo-home.svg" alt="Fasco logo" />
      </NuxtLink>
      </div>
   
      <div class="site-header__container_right">

      <!-- Desktop navigation -->
      <nav class="desktop-nav" aria-label="Main navigation">
        <ul class="desktop-nav__list">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="desktop-nav__link"
              active-class="is-active"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Desktop authentication -->
      <div class="header-actions">
        <NuxtLink to="/auth/signin" class="header-actions__link">
          Sign in
        </NuxtLink>

        <NuxtLink
          to="/auth/signup"
          class="header-actions__signup"
        >
          Sign up
        </NuxtLink>
      </div>

      <!-- Mobile menu button -->
      <button
        class="mobile-menu-button"
        type="button"
        :aria-expanded="isMobileMenuOpen"
        aria-controls="mobile-menu"
        :aria-label="isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
        @click="toggleMobileMenu"
      >
        <span class="mobile-menu-button__icon" aria-hidden="true">
          {{ isMobileMenuOpen ? '×' : '☰' }}
        </span>
      </button>

    

    <!-- Mobile navigation -->
    <div
      id="mobile-menu"
      v-show="isMobileMenuOpen"
      class="mobile-menu"
    >
      <nav aria-label="Mobile navigation">
        <ul class="mobile-menu__list">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="mobile-menu__link"
              active-class="is-active"
              @click="closeMobileMenu"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="mobile-menu__actions">
        <NuxtLink
          to="/auth/signin"
          class="mobile-menu__signin"
          @click="closeMobileMenu"
        >
          Sign in
        </NuxtLink>

        <NuxtLink
          to="/auth/signup"
          class="mobile-menu__signup"
          @click="closeMobileMenu"
        >
          Sign up
        </NuxtLink>
      </div>
    </div>
  </div>
</div>
  </header>
</template>
