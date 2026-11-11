
import { ref } from 'vue'
import type {
  CheckoutFormData,
  CheckoutFormErrors,
} from '~/types/order'

const requiredFields = [
  { key: 'email', label: 'Email address' },
  { key: 'country', label: 'Country / Region' },
  { key: 'firstName', label: 'First name' },
  { key: 'lastName', label: 'Last name' },
  { key: 'address', label: 'Address' },
  { key: 'city', label: 'City' },
  { key: 'postalCode', label: 'Postal code' },
] as const

export const useFormValidation = () => {
  const errors = ref<CheckoutFormErrors>({})

  const validateCheckout = (form: CheckoutFormData): boolean => {
    const newErrors: CheckoutFormErrors = {}

    // Validate all required fields
    for (const field of requiredFields) {
      if (!form[field.key].toString().trim()) {
        newErrors[field.key] = `${field.label} is required.`
      }
    }

    // Email format validation
    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = 'Please enter a valid email address.'
    }

    // Postal code validation
    if (
      form.postalCode.trim() &&
      form.postalCode.trim().length < 3
    ) {
      newErrors.postalCode = 'Please enter a valid postal code.'
    }

    errors.value = newErrors

    return Object.keys(newErrors).length === 0
  }

  const clearError = (field: keyof CheckoutFormErrors) => {
    delete errors.value[field]
  }

  const clearErrors = () => {
    errors.value = {}
  }

  return {
    errors,
    validateCheckout,
    clearError,
    clearErrors,
  }
}
