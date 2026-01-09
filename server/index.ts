import express from "express";
import path from "path";

import config from "./config";
import makeSessionForPaymentLink from "./payment-link";
import makeSessionForComponents from "./components";
import makeInvoice from "./invoice";

const app = express();

app.use(express.static(path.join(__dirname, "static")));

app.use(express.json());

app.post("/api/checkout", async (req, res) => {
  const data = req.body as PostCheckoutPayload;

  // Use the currency to select the correct API key
  const apiKey = config.apiKeyByCurrency[data.currency];

  if (!apiKey) {
    res.status(400).send({ error: "Unsupported currency" });
    return;
  }

  try {
    switch (data.integration) {
      case "session": {
        const paymentLinkSession = await makeSessionForPaymentLink(
          data,
          apiKey
        );
        res
          .status(200)
          .send({ checkout_url: paymentLinkSession.payment_link_url });
        break;
      }

      case "components": {
        const componentsSession = await makeSessionForComponents(data, apiKey);
        res.status(200).send({
          components_sdk_key: componentsSession.components_sdk_key,
        });
        break;
      }

      case "invoice": {
        const invoice = await makeInvoice(data, apiKey);
        res.status(200).send({ checkout_url: invoice.invoice_url });
        break;
      }

      default:
        res.status(400).send({ error: "Invalid integration type" });
        return;
    }
  } catch (error) {
    res
      .status(500)
      .send({ error: (error as Error).message || "Internal Server Error" });
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Demo Store Server is listening on port: ${port}`);
});
