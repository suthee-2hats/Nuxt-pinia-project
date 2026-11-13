
<script setup lang="ts">
const footerLinks = [
  { label: 'Support Center', href: '#' },
  { label: 'Invoicing', href: '#' },
  { label: 'Contract', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'FAQ,s', href: '#' },
]
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__container">
      <div class="app-footer__top">
        <NuxtLink
          to="/"
          class="app-footer__logo"
          aria-label="FASCO homepage"
        >
          <img src="/img/logo/logo-home.svg" alt="" />
        </NuxtLink>

        <nav
          class="app-footer__navigation"
          aria-label="Footer navigation"
        >
          <ul class="app-footer__list">
            <li
              v-for="link in footerLinks"
              :key="link.label"
              class="app-footer__item"
            >
              <NuxtLink
                :to="link.href"
                class="app-footer__link"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <p class="app-footer__copyright">
        Copyright © {{ new Date().getFullYear() }} FASCO. All Rights Reserved.
      </p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '../../assets/scss/abstracts' as *;

.app-footer {
  padding: 34px 20px;
  background-color: $color-surface;
  font-family: $font-sans;
  border-top: 1px solid #dedfe1;

  &__container {
    max-width: $container-max;
    margin: 0 auto;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
  }

  &__logo {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;

    img {
      display: block;
      width: 90px;
      height: auto;
    }

    @include focus-ring(3px, 5px);
  }

  &__list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 32px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  &__link {
    color: #484848;
    font-size: 16px;
    font-weight: 200;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: $color-ink;
    }

    @include focus-ring(3px, 5px);
  }

  &__copyright {
    margin: 44px 0 0;
    color: $color-body;
    font-size: 11px;
    text-align: center;
  }

  @include below(768px) {
    &__top {
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    &__list {
      justify-content: center;
      gap: 18px 24px;
    }

    &__copyright {
      margin-top: 32px;
    }
  }

  @include compact {
    margin: 0 12px;
    padding: 28px 16px;

    &__list {
      gap: 16px 20px;
    }
  }

  @include reduced-motion {
    &__link {
      transition: none;
    }
  }
}
</style>
