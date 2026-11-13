import type { CartItem } from "~/types/cart";
import { useCartStore } from "~/stores/cart";

const CART_KEY = "fasco-cart";

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.productId === "number" &&
    typeof item.title === "string" &&
    typeof item.thumbnail === "string" &&
    typeof item.price === "number" &&
    typeof item.discountPercentage === "number" &&
    typeof item.stock === "number" &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
};

export default defineNuxtPlugin((nuxtApp) => {
  const cart = useCartStore();

  const persist = () => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify({ items: cart.items }));
    } catch {
      // Storage may be unavailable (private mode, quota). The cart still
      // works for the current session.
    }
  };

  const hydrate = () => {
    try {
      const raw = localStorage.getItem(CART_KEY);

      if (raw) {
        const parsed = JSON.parse(raw) as { items?: unknown };

        if (Array.isArray(parsed.items)) {
          cart.$patch({
            items: parsed.items.filter(isCartItem),
          });
        }
      }
    } catch {
      // Ignore corrupt or outdated storage instead of breaking the app.
    }

    cart.$subscribe(persist, { detached: true });
  };

  // Restore the stored cart right after hydration resolves, so the server
  // and client markup match before the state changes.
  if (nuxtApp.isHydrating) {
    nuxtApp.hooks.hookOnce("app:suspense:resolve", hydrate);
  } else {
    hydrate();
  }
});
