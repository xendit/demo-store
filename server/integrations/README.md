# Serverside Integrations

This server implements three different integrations with Xendit:
 * Session API - Components
 * Session API - Payment Link
 * Invoice API - Payment Link

## Session API

The [Session API](https://docs.xendit.co/apidocs/create-session) supports two different integration methods:
 * Components
 * Payment Link

Both require the following base properties when you create the session on your server:

```typescript
type SessionRequest = {
    "reference_id": string,
    "session_type": "PAY" | "SAVE",
    "currency": string,
    "amount": number,
    "country": string
    "locale": string,
    "success_return_url": string,
    "cancel_return_url": string,
}
```


## Session API - Components

When using Components, you must also include the following properties when creating the session.

Clientside requests (from the browser) will be restricted to the origins you specify here.

```typescript
type ComponentsSessionRequest = SessionRequest & {
    mode: "COMPONENTS",
    components_configuration: {
        origins: string[] // e.g. ["https://your-site.com"]
    }
}
```

The server will respond with a `components_sdk_key` property, which you need to use to initialize the XenditComponents SDK on the clientside.

Send this key back to the client in the response from your server. Treat the key as a secret, don't save it or log it.

The clientside does not require your Xendit API key.


## Session API - Payment Link

When using Payment Links, you must include the following property when creating the session.

```typescript
type PaymentLinkSessionRequest = SessionRequest & {
    mode: "PAYMENT_LINK",
}
```

The server will respond with a `payment_link_url` property, you should redirect your customer to this URL.

Treat the URL as a secret, don't save it or log it.



## Invoice API - Payment Link

When using the legacy [Invoice API](https://archive.developers.xendit.co/api-reference/#invoices) to create a Payment Link, you need to pass the following properties:

```typescript
type InvoicePaymentLinkRequest = {
  external_id: string
  description: string,
  amount: number,
  invoice_duration: number, // seconds
  currency: string,
}
```

The server will respond with an `invoice_url` property, you should redirect your customer to this URL.
