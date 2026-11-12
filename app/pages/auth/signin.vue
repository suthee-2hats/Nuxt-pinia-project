<script setup lang="ts">
import { ref } from 'vue'
import type { SignInCredentials } from '~/types/user'
import SignInForm from '~/components/auth/SignInForm.vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const isSubmitting = ref(false)
const formError = ref('')

usePageSeo({
  title: 'Sign In',
  description:
    'Sign in to your FASCO account to continue shopping and check out faster.',
  noIndex: true,
})

const handleSubmit = async (credentials: SignInCredentials) => {
  if (isSubmitting.value) return

  formError.value = ''
  isSubmitting.value = true

  try {
    await userStore.signIn(credentials)
    await navigateTo('/')
  } catch {
    formError.value =
      userStore.error ?? 'Unable to sign in. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
<template>
  <div class="auth-page">
    <div class="auth-page__container">
      <nav class="auth-page__breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Sign in</span>
      </nav>

      <div class="auth-page__card">
        <header class="auth-page__header">
          <h1 class="auth-page__title">Sign in</h1>
          <p class="auth-page__lead">
            Welcome back. Sign in to continue shopping.
          </p>
        </header>

        <p
          v-if="formError"
          class="auth-page__alert"
          role="alert"
        >
          {{ formError }}
        </p>

        <SignInForm
          :is-submitting="isSubmitting"
          @submit="handleSubmit"
        />

      </div>
    </div>
  </div>
</template>
