import config from "../config";
import database from "../../data.json";

const POST_INVOICE_URL = "https://api.xendit.co/v2/invoices";

/**
 * Creates an legacy payment link (invoice) using the provided data and API key.
 */
const makeInvoice = async (
  data: PostCheckoutPayload,
  apiKey: string
): Promise<Invoice> => {
  const items = [];
  let amount = 0;
  const exchangeRate = database.exchangeRates[data.currency];
  for (const item of data.cart) {
    const product = database.products.find((product) => product.id === item.id);
    if (product) {
      const priceInCurrency = product.price * exchangeRate;
      items.push({
        name: product.title,
        quantity: item.quantity,
        price: priceInCurrency,
        category: "Plushxie",
      });
      amount += priceInCurrency * item.quantity;
    }
  }

  if (items.length === 0) {
    throw new Error("No valid items in the cart");
  }

  const fees = [{ type: "Admin", value: 0.5 * exchangeRate }];
  const feesTotal = fees.reduce((sum, fee) => sum + fee.value, 0);

  const now = new Date();

  const successReturnUrl = new URL(config.successUrl);
  successReturnUrl?.searchParams.append("flow", data.flow);
  successReturnUrl?.searchParams.append("integration", data.integration);

  const payload = {
    payer_email: "invoice+demo@xendit.co",
    description: "Checkout Demo with Legacy Payment Link (Invoice)",
    external_id: `checkout-demo-${now.getTime()}`,
    items,
    fees,
    currency: data.currency,
    amount: amount + feesTotal,
    success_redirect_url: successReturnUrl.toString(),
  };

  const response = await fetch(POST_INVOICE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(apiKey + ":").toString("base64")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message: string };
    throw new Error(`Failed to create invoice: ${errorData.message}`);
  }

  const invoice = (await response.json()) as Invoice;
  return invoice;
};

export default makeInvoice;
