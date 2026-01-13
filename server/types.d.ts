type Currency = "IDR" | "PHP" | "THB" | "SGD" | "VND";

type PostCheckoutPayload = {
  flow: "pay" | "save" | "pay_save";
  integration: "session" | "components" | "invoice";
  currency: Currency;
  cart: Array<{
    id: number;
    quantity: number;
  }>;
};

type PaymentLinkSession = {
  payment_link_url: string;
};

type ComponentsSession = {
  components_sdk_key: string;
};

type Invoice = {
  invoice_url: string;
};
