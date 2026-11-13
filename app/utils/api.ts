import { useRuntimeConfig } from '#imports'

/**
 * Base URL for the dummyjson API.
 *
 * Configured through NUXT_PUBLIC_API_BASE (see .env.example). It is public
 * on purpose: every request is made from the browser, so this value must not
 * contain secrets.
 */
export const getApiBase = (): string => useRuntimeConfig().public.apiBase
