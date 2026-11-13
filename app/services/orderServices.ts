import { getApiBase } from "~/utils/api";

export interface CreateOrderProduct {
  id: number;
  quantity: number;
}

export interface CreateOrderPayload {
  userId?: number;
  products: CreateOrderProduct[];
}

export interface OrderApiResponse {
  id: number;
  userId: number;
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

export const orderService = {
  createOrder(payload: CreateOrderPayload) {
    return $fetch<OrderApiResponse>(`${getApiBase()}/carts/add`, {
      method: "POST",
      body: {
        userId: payload.userId ?? 1,
        products: payload.products,
      },
    });
  },
};
