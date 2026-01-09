import data from "../../data.json";

export type PageType = "store" | "checkout" | "payment-success";

export interface CartItem {
  id: number;
  quantity: number;
}

export type Product = (typeof data.products)[number];
