
<script setup lang="ts">
import { reactive } from 'vue'
import type { SignInCredentials } from '~/types/user'
import { useFormValidation } from '~/composables/useFormValidation'

const emit = defineEmits<{
  submit: [credentials: SignInCredentials]
}>()

const form = reactive<SignInCredentials>({
  email: '',
  password: '',
})

const { errors, validateForm } =
  useFormValidation<SignInCredentials>()

const handleSubmit = () => {
  const isValid = validateForm(
    form,
    [
      { key: 'email', label: 'Email address' },
      { key: 'password', label: 'Password' },
    ],
    [
      {
        key: 'email',
        validate: (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? null
            : 'Please enter a valid email address.',
      },
    ],
  )

  if (!isValid) return

  emit('submit', { ...form })
}
</script>


<template>
  <form class="auth-form" @submit.prevent="handleSubmit" novalidate>
    <div class="auth-form__field">
      <label for="signin-email">Email address</label>

      <input
        id="signin-email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        required
        :aria-invalid="!!errors.email"
        :aria-describedby="errors.email ? 'signin-email-error' : undefined"
      />

      <p
        v-if="errors.email"
        id="signin-email-error"
        class="auth-form__error"
      >
        {{ errors.email }}
      </p>
    </div>

    <div class="auth-form__field">
      <label for="signin-password">Password</label>

      <input
        id="signin-password"
        v-model="form.password"
        type="password"
        autocomplete="current-password"
        required
        :aria-invalid="!!errors.password"
        :aria-describedby="errors.password ? 'signin-password-error' : undefined"
      />

      <p
        v-if="errors.password"
        id="signin-password-error"
        class="auth-form__error"
      >
        {{ errors.password }}
      </p>
    </div>

    <button type="submit" class="auth-form__submit">
      Sign In
    </button>

    <p class="auth-form__footer">
      Don't have an account?
      <NuxtLink to="/auth/signup">Create an account</NuxtLink>
    </p>
  </form>
</template>
