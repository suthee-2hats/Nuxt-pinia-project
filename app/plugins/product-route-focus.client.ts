/**
 * WCAG 2.4.3 — focus order.
 *
 * Client-side navigation replaces the page without moving focus, which leaves
 * keyboard and screen-reader users on <body>. After navigating to a product
 * detail page, move focus to its <h1> (tabindex="-1") once the destination
 * product has rendered.
 *
 * The initial page load is skipped so focus is not stolen on first paint.
 */
export default defineNuxtPlugin(() => {
  const router = useRouter()

  let isFirstNavigation = true

  const focusProductTitle = (productId: string) => {
    const deadline = Date.now() + 5000

    const attemptFocus = () => {
      const title = document.querySelector<HTMLElement>(
        `#product-title[data-product-id="${productId}"]`,
      )

      if (title) {
        title.focus()
        return
      }

      if (Date.now() < deadline) {
        window.setTimeout(attemptFocus, 50)
      }
    }

    attemptFocus()
  }

  router.afterEach((to, from) => {
    if (isFirstNavigation) {
      isFirstNavigation = false
      return
    }

    if (to.path === from.path) return
    if (!/^\/products\/[^/]+\/?$/.test(to.path)) return

    const productId = to.params.id

    if (typeof productId === 'string') {
      focusProductTitle(productId)
    }
  })
})
