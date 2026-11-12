
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useUserStore } from '~/stores/user'

interface NavItem {
  label: string
  path: string
  match: (routePath: string) => boolean
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    path: '/',
    match: (routePath) => routePath === '/',
  },
  {
    label: 'Shop',
    path: '/products',
    match: (routePath) => routePath === '/products',
  },
  {
    label: 'Products',
    path: '/products',
    match: (routePath) => routePath.startsWith('/products/'),
  },
]

const route = useRoute()
const userStore = useUserStore()

// Decide which header layout to display
const isHomePage = computed(() => route.path === '/')

const isNavItemActive = (item: NavItem) => item.match(route.path)

// Mobile menu state
const isMobileMenuOpen = ref(false)

const menuButtonRef = ref<HTMLButtonElement | null>(null)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const closeMobileMenuAndRestoreFocus = () => {
  if (!isMobileMenuOpen.value) return

  isMobileMenuOpen.value = false
  menuButtonRef.value?.focus()
}

// Close the disclosure when the route changes (links, browser back/forward).
watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false
  },
)

const handleSignOut = async () => {
  await userStore.signOut()
  closeMobileMenu()
  await navigateTo('/')
}
</script>

<template>
  <header
    class="site-header"
    :class="{ 'site-header--home': isHomePage, 'site-header--inner': !isHomePage }"
    @keydown.esc="closeMobileMenuAndRestoreFocus"
  >
    <div class="site-header__container container-global1">

      <!-- Section 1: Logo -->
      <div class="site-header__logo-section">
        <NuxtLink
          to="/"
          class="site-header__logo"
          aria-label="FASCO homepage"
          @click="closeMobileMenu"
        >
          <img src="/img/logo/logo-home.svg" alt="" />
        </NuxtLink>
      </div>

      <!-- Section 2: Navigation -->
      <nav class="desktop-nav" aria-label="Main navigation">
        <ul class="desktop-nav__list">
          <li v-for="item in navItems" :key="item.label">
            <NuxtLink
              :to="item.path"
              class="desktop-nav__link"
              :class="{ 'is-active': isNavItemActive(item) }"
              :aria-current="isNavItemActive(item) ? 'page' : undefined"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Section 3A: Homepage authentication -->
      <div v-if="isHomePage" class="header-actions">
        <template v-if="userStore.isAuthenticated">
          <span class="header-actions__greeting">
            Hi, {{ userStore.user?.firstName }}
          </span>

          <button
            type="button"
            class="header-actions__signout"
            @click="handleSignOut"
          >
            Sign out
          </button>
        </template>

        <template v-else>
          <NuxtLink to="/auth/signin" class="header-actions__link">
            Sign in
          </NuxtLink>

          <NuxtLink to="/auth/signup" class="header-actions__signup">
            Sign up
          </NuxtLink>
        </template>
      </div>

      <!-- Section 3B: Inner-page actions -->
      <div v-else class="site-header__user-actions">
        <NuxtLink
          to="/cart"
          class="site-header__action-link"
          aria-label="Shopping cart"
        >
          <span aria-hidden="true"><img src="/img/chart-icon.svg" width="20" height="20" alt="chart-icon"/></span>
        </NuxtLink>

        <NuxtLink
          to="/account"
          class="site-header__action-link"
          aria-label="My account"
        >
          <span aria-hidden="true"><img src="/img/profile-icon.svg" width="20" height="20" alt="profile-icon" /></span>
        </NuxtLink>
      </div>

      <!-- Mobile menu button -->
      <button
        ref="menuButtonRef"
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
    </div>

    <!-- Mobile navigation -->
    <div
      id="mobile-menu"
      v-show="isMobileMenuOpen"
      class="mobile-menu"
    >
      <nav aria-label="Mobile navigation">
        <ul class="mobile-menu__list">
          <li v-for="item in navItems" :key="item.label">
            <NuxtLink
              :to="item.path"
              class="mobile-menu__link"
              :class="{ 'is-active': isNavItemActive(item) }"
              :aria-current="isNavItemActive(item) ? 'page' : undefined"
              @click="closeMobileMenu"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Page-relevant actions, only visible inside the disclosure -->
      <div class="mobile-menu__actions">
        <template v-if="isHomePage">
          <template v-if="userStore.isAuthenticated">
            <NuxtLink
              to="/account"
              class="mobile-menu__account-link"
              @click="closeMobileMenu"
            >
              My account
            </NuxtLink>

            <button
              type="button"
              class="mobile-menu__signout"
              @click="handleSignOut"
            >
              Sign out
            </button>
          </template>

          <template v-else>
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
          </template>
        </template>

        <template v-else>
          <NuxtLink
            to="/cart"
            class="mobile-menu__account-link"
            @click="closeMobileMenu"
          >
            Shopping cart
          </NuxtLink>

          <NuxtLink
            to="/account"
            class="mobile-menu__account-link"
            @click="closeMobileMenu"
          >
            My account
          </NuxtLink>

          <button
            v-if="userStore.isAuthenticated"
            type="button"
            class="mobile-menu__signout"
            @click="handleSignOut"
          >
            Sign out
          </button>

          <NuxtLink
            v-else
            to="/auth/signin"
            class="mobile-menu__account-link"
            @click="closeMobileMenu"
          >
            Sign in
          </NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>
