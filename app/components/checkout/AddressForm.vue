
<script setup lang="ts">
import { ref, watch } from 'vue'
import type {
  CheckoutFormData,
  CheckoutFormErrors,
} from '~/types/order'

const props = defineProps<{
  modelValue: CheckoutFormData
  errors: CheckoutFormErrors
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CheckoutFormData]
  'clear-error': [field: keyof CheckoutFormErrors]
}>()

// Local draft so consecutive synchronous updates (e.g. browser autofill)
// merge instead of overwriting each other with a stale object.
const draft = ref<CheckoutFormData>({ ...props.modelValue })

watch(
  () => props.modelValue,
  (value) => {
    draft.value = { ...value }
  },
)

type TextFieldKey =
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'address'
  | 'city'
  | 'postalCode'

const countries = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
]

const deliveryFields: {
  key: Exclude<TextFieldKey, 'email'>
  label: string
  placeholder: string
  autocomplete: string
  fullWidth?: boolean
}[] = [
  {
    key: 'firstName',
    label: 'First name',
    placeholder: 'First Name',
    autocomplete: 'given-name',
  },
  {
    key: 'lastName',
    label: 'Last name',
    placeholder: 'Last Name',
    autocomplete: 'family-name',
  },
  {
    key: 'address',
    label: 'Address',
    placeholder: 'Address',
    autocomplete: 'street-address',
    fullWidth: true,
  },
  {
    key: 'city',
    label: 'City',
    placeholder: 'City',
    autocomplete: 'address-level2',
  },
  {
    key: 'postalCode',
    label: 'Postal code',
    placeholder: 'Postal Code',
    autocomplete: 'postal-code',
  },
]

const updateField = <K extends keyof CheckoutFormData>(
  field: K,
  value: CheckoutFormData[K],
) => {
  draft.value = {
    ...draft.value,
    [field]: value,
  }

  emit('update:modelValue', draft.value)
  emit('clear-error', field as keyof CheckoutFormErrors)
}
</script>

<template>
  <div class="address-form">
    <!-- Contact -->
    <section
      class="address-form__section"
      aria-labelledby="contact-heading"
    >
      <div class="address-form__heading">
        <h2 id="contact-heading">Contact</h2>

        <p>
          Have an account?
          <NuxtLink to="/auth/signin">Sign in</NuxtLink>
        </p>
      </div>

      <div class="address-form__field">
        <label for="checkout-email">Email address</label>

        <input
          id="checkout-email"
          type="email"
          autocomplete="email"
          placeholder="Email Address"
          :value="draft.email"
          :aria-invalid="!!errors.email"
          :aria-describedby="errors.email ? 'email-error' : undefined"
          required
          @input="updateField(
            'email',
            ($event.target as HTMLInputElement).value
          )"
        />

        <p
          v-if="errors.email"
          id="email-error"
          class="address-form__error"
        >
          {{ errors.email }}
        </p>
      </div>
    </section>

    <!-- Delivery -->
    <section
      class="address-form__section"
      aria-labelledby="delivery-heading"
    >
      <h2 id="delivery-heading">Delivery</h2>

      <!-- Country -->
      <div class="address-form__field">
        <label for="checkout-country">Country / Region</label>

        <select
          id="checkout-country"
          autocomplete="country-name"
          :value="draft.country"
          :aria-invalid="!!errors.country"
          :aria-describedby="errors.country ? 'country-error' : undefined"
          required
          @change="updateField(
            'country',
            ($event.target as HTMLSelectElement).value
          )"
        >
          <option value="" disabled>Select country / region</option>

          <option
            v-for="country in countries"
            :key="country"
            :value="country"
          >
            {{ country }}
          </option>
        </select>

        <p
          v-if="errors.country"
          id="country-error"
          class="address-form__error"
        >
          {{ errors.country }}
        </p>
      </div>

      <!-- Delivery fields -->
      <div class="address-form__grid">
        <div
          v-for="field in deliveryFields"
          :key="field.key"
          class="address-form__field"
          :class="{ 'address-form__field--full': field.fullWidth }"
        >
          <label :for="`checkout-${field.key}`">
            {{ field.label }}
          </label>

          <input
            :id="`checkout-${field.key}`"
            type="text"
            :autocomplete="field.autocomplete"
            :placeholder="field.placeholder"
            :value="draft[field.key]"
            :aria-invalid="!!errors[field.key]"
            :aria-describedby="
              errors[field.key]
                ? `checkout-${field.key}-error`
                : undefined
            "
            required
            @input="updateField(
              field.key,
              ($event.target as HTMLInputElement).value
            )"
          />

          <p
            v-if="errors[field.key]"
            :id="`checkout-${field.key}-error`"
            class="address-form__error"
          >
            {{ errors[field.key] }}
          </p>
        </div>
      </div>

      <!-- Save information -->
      <label class="address-form__checkbox">
        <input
          type="checkbox"
          :checked="draft.saveInformation"
          @change="updateField(
            'saveInformation',
            ($event.target as HTMLInputElement).checked
          )"
        />

        <span>Save this information for future</span>
      </label>
    </section>
  </div>
</template>
