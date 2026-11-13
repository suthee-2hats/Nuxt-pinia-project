export type PaymentMethod = "card";

export type ShippingMethod = "standard" | "express";

export interface CheckoutFormData {
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  saveInformation: boolean;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
}

export interface CheckoutFormErrors {
  email?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface ShippingOption {
  id: ShippingMethod;
  label: string;
  description: string;
  price: number;
}

export interface Order {
  id: string;
  items: import("./cart").CartItem[];
  customer: CheckoutFormData;
  subtotal: number;
  shipping: number;
  total: number;
  status: "placed" | "pending";
  createdAt: string;
}
