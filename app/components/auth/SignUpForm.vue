
<script setup lang="ts">
import { reactive } from 'vue'
import type { SignUpData } from '~/types/user'
import { useFormValidation } from '~/composables/useFormValidation'

const emit = defineEmits<{
  submit: [data: SignUpData]
}>()

const form = reactive<SignUpData>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const { errors, validateForm } =
  useFormValidation<SignUpData>()

const handleSubmit = () => {
  const isValid = validateForm(
    form,
    [
      { key: 'firstName', label: 'First name' },
      { key: 'lastName', label: 'Last name' },
      { key: 'email', label: 'Email address' },
      { key: 'password', label: 'Password' },
      { key: 'confirmPassword', label: 'Confirm password' },
    ],
    [
      {
        key: 'email',
        validate: (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? null
            : 'Please enter a valid email address.',
      },
      {
        key: 'password',
        validate: (value) =>
          value.length >= 8
            ? null
            : 'Password must contain at least 8 characters.',
      },
      {
        key: 'confirmPassword',
        validate: (value, formData) =>
          value === formData.password
            ? null
            : 'Passwords do not match.',
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
      <label for="signup-first-name">First name</label>
      <input
        id="signup-first-name"
        v-model="form.firstName"
        autocomplete="given-name"
        required
        :aria-invalid="!!signUpErrors.firstName"
        :aria-describedby="signUpErrors.firstName ? 'signup-first-name-error' : undefined"
      />
      <p v-if="signUpErrors.firstName" id="signup-first-name-error" class="auth-form__error">
        {{ signUpErrors.firstName }}
      </p>
    </div>

    <div class="auth-form__field">
      <label for="signup-last-name">Last name</label>
      <input
        id="signup-last-name"
        v-model="form.lastName"
        autocomplete="family-name"
        required
        :aria-invalid="!!signUpErrors.lastName"
        :aria-describedby="signUpErrors.lastName ? 'signup-last-name-error' : undefined"
      />
      <p v-if="signUpErrors.lastName" id="signup-last-name-error" class="auth-form__error">
        {{ signUpErrors.lastName }}
      </p>
    </div>

    <div class="auth-form__field">
      <label for="signup-email">Email address</label>
      <input
        id="signup-email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        required
        :aria-invalid="!!signUpErrors.email"
        :aria-describedby="signUpErrors.email ? 'signup-email-error' : undefined"
      />
      <p v-if="signUpErrors.email" id="signup-email-error" class="auth-form__error">
        {{ signUpErrors.email }}
      </p>
    </div>

    <div class="auth-form__field">
      <label for="signup-password">Password</label>
      <input
        id="signup-password"
        v-model="form.password"
        type="password"
        autocomplete="new-password"
        required
        :aria-invalid="!!signUpErrors.password"
        :aria-describedby="signUpErrors.password ? 'signup-password-error' : undefined"
      />
      <p v-if="signUpErrors.password" id="signup-password-error" class="auth-form__error">
        {{ signUpErrors.password }}
      </p>
    </div>

    <div class="auth-form__field">
      <label for="signup-confirm-password">Confirm password</label>
      <input
        id="signup-confirm-password"
        v-model="form.confirmPassword"
        type="password"
        autocomplete="new-password"
        required
        :aria-invalid="!!signUpErrors.confirmPassword"
        :aria-describedby="signUpErrors.confirmPassword ? 'signup-confirm-password-error' : undefined"
      />
      <p
        v-if="signUpErrors.confirmPassword"
        id="signup-confirm-password-error"
        class="auth-form__error"
      >
        {{ signUpErrors.confirmPassword }}
      </p>
    </div>

    <button type="submit" class="auth-form__submit">
      Create Account
    </button>

    <p class="auth-form__footer">
      Already have an account?
      <NuxtLink to="/auth/signin">Sign in</NuxtLink>
    </p>
  </form>
</template>
