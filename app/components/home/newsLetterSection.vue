<script setup lang="ts">
import { ref } from 'vue'
const email = ref('')
const isSubmitted = ref(false)

const handleSubscribe = () => {
  if (email.value) {
    // Add your submit logic/API call here
    isSubmitted.value = true
    setTimeout(() => {
      email.value = ''
      isSubmitted.value = false
    }, 3000)
  }
}
</script>

<template>
  <section class="newsletter">
    <!-- Left Model Image -->
    <div class="newsletter__image newsletter__image--left">
      <img
        src="~/assets/img/newLetter/left.avif"
        alt="Fashion Model Left"
        loading="lazy"
      />
    </div>

    <!-- Center Content -->
    <div class="newsletter__content">
      <h2 class="newsletter__title">Subscribe To Our Newsletter</h2>
      <p class="newsletter__description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis
        ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin.
      </p>

      <form class="newsletter__form" @submit.prevent="handleSubscribe">
        <input
          v-model="email"
          type="email"
          placeholder="michael@ymail.com"
          required
          class="newsletter__input"
        />
        <button type="submit" class="newsletter__button">
          {{ isSubmitted ? 'Subscribed!' : 'Subscribe Now' }}
        </button>
      </form>
    </div>

    <!-- Right Model Image -->
    <div class="newsletter__image newsletter__image--right">
      <img
        src="~/assets/img/newLetter/right.avif"
        alt="Fashion Model Right"
        loading="lazy"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../../assets/scss/abstracts' as *;

.newsletter {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1300px;
  margin: 0 auto;
  padding: 60px 24px;
  min-height: 500px;
  overflow: hidden;
}

.newsletter__content {
  flex: 1;
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
  z-index: 2;
}

.newsletter__title {
  font-family: 'Playfair Display', Georgia, serif; /* Matches serif headline style */
  font-size: 38px;
  font-weight: 600;
  color: $color-heading;
  margin-bottom: 16px;
  line-height: 1.2;
}

.newsletter__description {
  font-size: 14px;
  color: $color-faint;
  line-height: 1.6;
  margin-bottom: 32px;
}

.newsletter__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.newsletter__input {
  width: 100%;
  max-width: 420px;
  padding: 16px 20px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: $color-surface;
  font-size: 14px;
  color: $color-heading;
  outline: none;
  box-shadow: 0 4px 20px rgb(0 0 0 / 3%); /* Soft inner/bottom shadow */
  text-align: center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: #b0b0b0;
  }

  &:focus {
    border-color: $color-border;
    box-shadow: 0 4px 25px rgb(0 0 0 / 7%);
  }
}

.newsletter__button {
  padding: 14px 40px;
  background-color: $color-ink;
  color: $color-surface;
  border: none;
  border-radius: 8px; /* Slightly rounded pill-like shape */
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 8px 20px rgb(0 0 0 / 15%); /* Floating black button shadow */
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    background-color: $color-ink-soft;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

/* Image Placement */
.newsletter__image {
  flex: 0 0 280px;
  height:fit-content;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.08)); /* Ground shadow under cutout models */
  }
}

// Responsive Breakpoints
@media (max-width: 1024px) {
  .newsletter__image {
    flex: 0 0 200px;
    height: 380px;
    img {
      width: auto;
      height: 100%;}
  }

  .newsletter__title {
    font-size: 30px;
  }
}

@media (max-width: 768px) {
  .newsletter {
    flex-direction: column;
    padding: 40px 16px;
  }

  .newsletter__image {
    display: none; /* Hide side models on small mobile screens */
  }

  .newsletter__title {
    font-size: 26px;
  }
}
</style>