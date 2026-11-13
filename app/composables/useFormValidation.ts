import { ref } from "vue";

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

interface RequiredField<T> {
  key: keyof T;
  label: string;
}

interface ValidationRule<T> {
  key: keyof T;
  validate: (value: string, form: T) => string | null;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useFormValidation = <T extends object>() => {
  const errors = ref<ValidationErrors<T>>({});

  const validateForm = (
    form: T,
    requiredFields: RequiredField<T>[],
    rules: ValidationRule<T>[] = [],
  ): boolean => {
    const newErrors: ValidationErrors<T> = {};

    // 1. Required field validation
    for (const field of requiredFields) {
      const value = String(form[field.key] ?? "");

      if (!value.trim()) {
        newErrors[field.key] = `${field.label} is required.`;
      }
    }

    // 2. Additional validation rules
    for (const rule of rules) {
      const value = String(form[rule.key] ?? "");

      if (value.trim()) {
        const error = rule.validate(value, form);

        if (error) {
          newErrors[rule.key] = error;
        }
      }
    }

    errors.value = newErrors;

    return Object.keys(newErrors).length === 0;
  };

  // Clear an individual field error
  const clearError = (field: keyof T) => {
    const { [field]: _removed, ...remainingErrors } = errors.value;
    errors.value = remainingErrors;
  };

  // Clear all errors
  const clearErrors = () => {
    errors.value = {};
  };

  return {
    errors,
    validateForm,
    clearError,
    clearErrors,
  };
};
