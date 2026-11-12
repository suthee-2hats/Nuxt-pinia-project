<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import type { SignInCredentials } from '~/types/user'
import { useFormValidation } from '~/composables/useFormValidation'

defineProps<{
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  submit: [credentials: SignInCredentials]
}>()

const form = reactive<SignInCredentials>({
  email: '',
  password: '',
})

const formRef = ref<HTMLFormElement | null>(null)

const { errors, validateForm, clearError } =
  useFormValidation<SignInCredentials>()

const focusFirstInvalidField = async () => {
  await nextTick()

  formRef.value
    ?.querySelector<HTMLElement>('[aria-invalid="true"]')
    ?.focus()
}

const handleSubmit = async () => {
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

  if (!isValid) {
    await focusFirstInvalidField()
    return
  }

  emit('submit', { ...form })
}
</script>

<template>
  <form
    ref="formRef"
    class="auth-form"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <div class="auth-form__field">
      <label for="signin-email">Email address</label>

      <input
        id="signin-email"
        v-model="form.email"
        type="email"
        name="email"
        autocomplete="email"
        required
        :aria-invalid="!!errors.email"
        :aria-describedby="errors.email ? 'signin-email-error' : undefined"
        @input="clearError('email')"
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
        name="password"
        autocomplete="current-password"
        required
        :aria-invalid="!!errors.password"
        :aria-describedby="errors.password ? 'signin-password-error' : undefined"
        @input="clearError('password')"
      />

      <p
        v-if="errors.password"
        id="signin-password-error"
        class="auth-form__error"
      >
        {{ errors.password }}
      </p>
    </div>

    <button
      type="submit"
      class="auth-form__submit"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? 'Signing in…' : 'Sign In' }}
    </button>

    <p class="auth-form__footer">
      Don't have an account?
      <NuxtLink to="/auth/signup">Create an account</NuxtLink>
    </p>
  </form>
</template>
