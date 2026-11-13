<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();

const addressLine = computed(() => {
  const address = userStore.user?.address;

  if (!address) return "";

  return [address.address, address.city, address.postalCode, address.country]
    .filter((part) => part && part.trim())
    .join(", ");
});

usePageSeo({
  title: "My Account",
  description:
    "View your FASCO account details, saved delivery information and sign out.",
  noIndex: true,
});

const handleSignOut = async () => {
  await userStore.signOut();
  await navigateTo("/");
};
</script>

<template>
  <div class="account-page">
    <div class="account-page__container">
      <div class="account-page__card">
        <template v-if="userStore.user">
          <h1 class="account-page__title">My account</h1>

          <p class="account-page__lead">
            Signed in as {{ userStore.user.email }}
          </p>

          <dl class="account-page__details">
            <div>
              <dt>Name</dt>
              <dd>{{ userStore.displayName }}</dd>
            </div>

            <div>
              <dt>Email</dt>
              <dd>{{ userStore.user.email }}</dd>
            </div>

            <div v-if="userStore.user.phone">
              <dt>Phone</dt>
              <dd>{{ userStore.user.phone }}</dd>
            </div>

            <div v-if="addressLine">
              <dt>Address</dt>
              <dd>{{ addressLine }}</dd>
            </div>
          </dl>

          <button
            type="button"
            class="account-page__button"
            @click="handleSignOut"
          >
            Sign out
          </button>
        </template>

        <template v-else>
          <h1 class="account-page__title">My account</h1>

          <p class="account-page__lead">
            You are not signed in. Sign in to see your details, or create an
            account.
          </p>

          <div class="account-page__actions">
            <NuxtLink to="/auth/signin" class="account-page__button">
              Sign in
            </NuxtLink>

            <NuxtLink
              to="/auth/signup"
              class="account-page__button account-page__button--secondary"
            >
              Create an account
            </NuxtLink>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
