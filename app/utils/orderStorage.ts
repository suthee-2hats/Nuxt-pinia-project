import type { Order } from "~/types/order";

const ORDER_KEY = "fasco-last-order";

export const saveLastOrder = (order: Order) => {
  try {
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
  } catch {
    // Storage can be unavailable (private mode, quota); the order still
    // renders for the current session.
  }
};

export const readLastOrder = (): Order | null => {
  try {
    const raw = sessionStorage.getItem(ORDER_KEY);

    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
};
