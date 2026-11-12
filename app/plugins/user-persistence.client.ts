import type { User } from '~/types/user'
import { useUserStore } from '~/stores/user'

const USER_KEY = 'fasco-user'

const isUser = (value: unknown): value is User => {
  if (!value || typeof value !== 'object') return false

  const user = value as Record<string, unknown>

  return (
    (typeof user.id === 'number' || typeof user.id === 'string') &&
    typeof user.firstName === 'string' &&
    typeof user.lastName === 'string' &&
    typeof user.email === 'string'
  )
}

export default defineNuxtPlugin((nuxtApp) => {
  const userStore = useUserStore()

  const persist = () => {
    try {
      if (userStore.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(userStore.user))
      } else {
        localStorage.removeItem(USER_KEY)
      }
    } catch {
      // Storage may be unavailable (private mode, quota). Authentication
      // still works for the current session.
    }
  }

  const hydrate = () => {
    try {
      const raw = localStorage.getItem(USER_KEY)

      if (raw) {
        const parsed: unknown = JSON.parse(raw)

        if (isUser(parsed)) {
          userStore.setUser(parsed)
        } else {
          localStorage.removeItem(USER_KEY)
        }
      }
    } catch {
      // Ignore corrupt storage instead of breaking the app.
    }

    userStore.$subscribe(persist, { detached: true })
  }

  // Restore the stored session right after hydration resolves, so the server
  // and client markup match before the state changes.
  if (nuxtApp.isHydrating) {
    nuxtApp.hooks.hookOnce('app:suspense:resolve', hydrate)
  } else {
    hydrate()
  }
})
