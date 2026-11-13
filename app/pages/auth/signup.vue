<script setup lang="ts">
import { ref } from "vue";
import type { SignUpData } from "~/types/user";
import SignUpForm from "~/components/auth/SignUpForm.vue";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();

const isSubmitting = ref(false);
const formError = ref("");

usePageSeo({
  title: "Create Account",
  description:
    "Create a FASCO account to save your details and check out faster.",
  noIndex: true,
});

const handleSubmit = async (data: SignUpData) => {
  if (isSubmitting.value) return;

  formError.value = "";
  isSubmitting.value = true;

  try {
    await userStore.signUp(data);
    await navigateTo("/");
  } catch {
    formError.value =
      userStore.error ?? "Unable to create your account. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-page__container">
      <nav class="auth-page__breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Create account</span>
      </nav>

      <div class="auth-page__card">
        <header class="auth-page__header">
          <h1 class="auth-page__title">Create an account</h1>
          <p class="auth-page__lead">
            Join FASCO to save your details and check out faster.
          </p>
        </header>

        <p v-if="formError" class="auth-page__alert" role="alert">
          {{ formError }}
        </p>

        <SignUpForm :is-submitting="isSubmitting" @submit="handleSubmit" />
      </div>
    </div>
  </div>
</template>
