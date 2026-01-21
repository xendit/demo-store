import config from "../config";
import database from "../../data.json";

const POST_SESSION_URL = "https://api.xendit.co/sessions";

/**
 * Creates a Session for Payment Link integration using the provided data.
 */
const makeSessionForPaymentLink = async (
  data: PostCheckoutPayload,
  apiKey: string
): Promise<PaymentLinkSession> => {
  const items = [];
  let amount = 0;

  if (data.flow !== "save") {
    for (const item of data.cart) {
      const product = database.products.find(
        (product) => product.id === item.id
      );
      if (product) {
        const priceInCurrency =
          product.price * database.exchangeRates[data.currency];
        items.push({
          name: product.title,
          quantity: item.quantity,
          net_unit_amount: priceInCurrency,
          reference_id: `product-${product.id}`,
          category: "Plushxie",
          type: "PHYSICAL_PRODUCT",
        });
        amount += priceInCurrency * item.quantity;
      }
    }

    if (items.length === 0) {
      throw new Error("No valid items in the cart");
    }
  }

  const now = new Date();
  const successReturnUrl = config.successUrl.match(
    /^(https:\/\/)([a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+)(\/[^\s#]*)?(\?[^\s#]*)?(#\S*)?$/i
  )
    ? new URL(config.successUrl)
    : undefined;

  successReturnUrl?.searchParams.append("flow", data.flow);
  successReturnUrl?.searchParams.append("integration", data.integration);

  const payload = {
    reference_id: `checkout-demo-${now.getTime()}`,
    customer: {
      type: "INDIVIDUAL",
      reference_id: `demo-customer-${now.getTime()}`,
      email: "demo@xendit.co",
      individual_detail: {
        given_names: "Checkout",
        surname: "Demo",
      },
    },
    session_type: data.flow === "save" ? "SAVE" : "PAY",
    allow_save_payment_method:
      data.flow === "pay_save" ? "OPTIONAL" : "DISABLED",
    currency: data.currency,
    amount,
    items,
    country: config.countryByCurrency[data.currency],
    description: "Checkout Demo with Sessions Payment Link",
    success_return_url: successReturnUrl?.toString(),

    // Set the right mode for Payment Link integration
    mode: "PAYMENT_LINK",
  };

  const response = await fetch(POST_SESSION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(apiKey + ":").toString("base64")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message: string };
    throw new Error(
      `Failed to create session payment link: ${errorData.message}`
    );
  }

  const session = (await response.json()) as PaymentLinkSession;
  return session;
};

export default makeSessionForPaymentLink;
