import { defineStore } from 'pinia'
import type { Product } from '~/types/product'
import type { CartItem } from '~/types/cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    itemCount: (state) => {
      return state.items.reduce((total, item) => {
        return total + item.quantity
      }, 0)
    },
    getItemQuantity: (state) => {
      return (productId: Product['id']) => {
        const item = state.items.find(
          (item) => item.productId === productId,
        )

        return item?.quantity ?? 0
      }
    },
    isEmpty: (state) => state.items.length === 0,
    subtotal: (state) => {
      return state.items.reduce((total, item) => {
        const unitPrice =
          item.price * (1 - item.discountPercentage / 100)

        return total + unitPrice * item.quantity
      }, 0)
    },
  },

  actions: {
    addItem(product: Product, quantity = 1): boolean {
      // Validate requested quantity
      if (
        product.stock <= 0 ||
        !Number.isInteger(quantity) ||
        quantity < (product.minimumOrderQuantity ?? 1)
      ) {
        return false
      }

      const existingItem = this.items.find(
        (item) => item.productId === product.id,
      )

      if (existingItem) {
        const updatedQuantity = existingItem.quantity + quantity

        // Prevent exceeding available stock
        if (updatedQuantity > existingItem.stock) {
          return false
        }

        existingItem.quantity = updatedQuantity
      } else {
        if (quantity > product.stock) {
          return false
        }

        this.items.push({
          productId: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          price: product.price,
          discountPercentage: product.discountPercentage,
          stock: product.stock,
          quantity,
        })
      }

      return true
    },
    removeItem(productId: Product['id']) {
      this.items = this.items.filter(
        (item) => item.productId !== productId,
      )
    },
    clearCart() {
      this.items = []
    },
  },
})