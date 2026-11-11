const API_URL = 'https://dummyjson.com'

export interface CreateOrderProduct {
  id: number
  quantity: number
}

export interface CreateOrderPayload {
  userId?: number
  products: CreateOrderProduct[]
}

export interface OrderApiResponse {
  id: number
  userId: number
  total: number
  discountedTotal: number
  totalProducts: number
  totalQuantity: number
}

export const orderService = {
  // dummyjson does not persist orders, but this endpoint gives us a
  // realistic server round-trip and an order ID.
  createOrder(payload: CreateOrderPayload) {
    return $fetch<OrderApiResponse>(`${API_URL}/carts/add`, {
      method: 'POST',
      body: {
        userId: payload.userId ?? 1,
        products: payload.products,
      },
    })
  },
}
