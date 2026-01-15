import express from "express";
import path from "path";
import https from "https";
import fs from "fs";

import config from "./config";
import makeSessionForPaymentLink from "./integrations/payment-link";
import makeSessionForComponents from "./integrations/components";
import makeInvoice from "./integrations/invoice";

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

if (process.env.ENABLE_HTTPS !== "true") {
  app.listen(port, () => {
    console.log(`Demo Store Server is listening on port: ${port}`);
  });
} else {
  // SSL Certificate configuration
  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH || "./certs/key.pem"),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH || "./certs/cert.pem"),
  };

  // Create HTTPS server
  const server = https.createServer(sslOptions, app);

  server.listen(port, () => {
    console.log(`Demo Store Server (HTTPS) is listening on port: ${port}`);
  });
}
