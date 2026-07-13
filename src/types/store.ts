import data from "../../data.json";

export type PageType = "store" | "checkout" | "checkout-iframe" | "success";

export type Flow = "pay" | "save" | "pay_save" | "subscription";

export interface CartItem {
  id: number;
  quantity: number;
}

export type Product = (typeof data.products)[number];
