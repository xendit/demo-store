import data from "../../data.json";

export type PageType = "store" | "checkout" | "checkout-iframe" | "success";

export interface CartItem {
  id: number;
  quantity: number;
}

export type Product = (typeof data.products)[number];

export const CHECKOUT_STORAGE_KEY = "xendit-demo-checkout";

export interface StoredCheckout {
  componentsKey: string;
  flow: string;
  currency: string;
  integration: string;
  cart: CartItem[];
}
