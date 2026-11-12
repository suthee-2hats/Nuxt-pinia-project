
import { ref } from 'vue'

type ValidationErrors = Record<string, string>

interface RequiredField {
  key: string
  label: string
}

interface ValidationRule<T> {
  key: keyof T
  validate: (value: string, form: T) => string | null
}

export const useFormValidation = <T extends object>() => {
  const errors = ref<ValidationErrors>({})

  const validateForm = (
    form: T,
    requiredFields: RequiredField[],
    rules: ValidationRule<T>[] = [],
  ): boolean => {
    const newErrors: ValidationErrors = {}

    // 1. Required field validation
    for (const field of requiredFields) {
      const value = String(form[field.key] ?? '')

      if (!value.trim()) {
        newErrors[field.key] = `${field.label} is required.`
      }
    }

    // 2. Additional validation rules
    for (const rule of rules) {
      const value = String(form[rule.key] ?? '')

      if (value.trim()) {
        const error = rule.validate(value, form)

        if (error) {
          newErrors[rule.key as string] = error
        }
      }
    }

    errors.value = newErrors

    return Object.keys(newErrors).length === 0
  }

  // Clear an individual field error
  const clearError = (field: keyof T) => {
    delete errors.value[field as string]
  }

  // Clear all errors
  const clearErrors = () => {
    errors.value = {}
  }

  return {
    errors,
    validateForm,
    clearError,
    clearErrors,
  }
}
