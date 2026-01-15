# Xendit Demo Store

A comprehensive demo application showcasing Xendit's payment integrations across Southeast Asia. This full-stack React/Node.js application demonstrates how to implement Xendit's Sessions API with both Payment Link and Components integration methods.

## Quick Start

### Prerequisites

- Node.js 18+
- Xendit API key(s) for your target markets

### Setup

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd demo-store
   npm install
   ```

2. **Configure environment**
   Create a `.env` file with your Xendit API keys:

   ```env
   # Required: Add API keys for markets you want to support
   IDR_API_KEY=your_indonesia_api_key
   PHP_API_KEY=your_philippines_api_key
   MYR_API_KEY=your_malaysia_api_key
   THB_API_KEY=your_thailand_api_key
   VND_API_KEY=your_vietnam_api_key
   SGD_API_KEY=your_singapore_api_key

   # Optional: Custom app URL (defaults to http://localhost:5173)
   APP_URL=http://localhost:5173
   ```

3. **Run the demo**

   ```bash
   npm run dev
   ```

   This starts both the React frontend (port 5173) and Express backend (port 8000).

## 💳 Integration Methods

This demo showcases two primary Xendit integration approaches:

### 1. Payment Link Integration

**Best for:** Quick setup, hosted checkout experience

- Redirects customers to Xendit's hosted payment page
- Minimal frontend integration required
- Supports all payment methods available in each market

### 2. Components Integration

**Best for:** Embedded checkout, custom UI control

- Embed payment forms directly in your application
- Import using Xendit CDN (recommended), or via NPM package
- Full UI/UX control while leveraging Xendit's payment processing
- Real-time payment method availability based on customer location

## 🌏 Multi-Currency Support

The demo supports all major Southeast Asian currencies:

- **IDR** (Indonesian Rupiah) - Indonesia
- **PHP** (Philippine Peso) - Philippines
- **MYR** (Malaysian Ringgit) - Malaysia
- **THB** (Thai Baht) - Thailand
- **VND** (Vietnamese Dong) - Vietnam
- **SGD** (Singapore Dollar) - Singapore

_Note: you will need to provide an API key for each to enable checkout using the selected currency._

Exchange rates are automatically applied based on selected currency.

## 🔄 Payment Flows

Explore different payment scenarios:

- **Pay**: One-time payment for immediate checkout
- **Save**: Capture payment method for future use (tokenization)
- **Pay and Save**: Process payment and optionally save payment method

## 🛠 Technical Architecture

### Backend (`/server`)

- **Express.js** API server
- **TypeScript** with modern ES modules
- **Sessions API integration** for both Payment Link and Components
- **Multi-currency** rate conversion
- **Environment-based** API key management

### Frontend (`/src`)

- **React 19** with TypeScript
- **Vite** for fast development and building
- **CSS Modules** for component styling
- **Real-time** integration switching and currency conversion

### Key Files

- [`src/pages/Checkout/Payment.tsx`](src/pages/Checkout/Payment.tsx) - Frontend payment handling
- [`server/integrations/payment-link.ts`](server/integrations/payment-link.ts) - Payment Link integration logic
- [`server/integrations/components.ts`](server/integrations/components.ts) - Components integration logic
- [`server/integrations/config.ts`](server/integrations/config.ts) - Multi-currency API key configuration

## 🌟 Key Features Demonstrated

- ✅ Multi-market payment processing (6 SEA countries)
- ✅ Currency conversion and localization
- ✅ Payment method tokenization (save cards/accounts)
- ✅ Real-time payment status updates
- ✅ Mobile-responsive checkout experience
- ✅ Error handling and user feedback
- ✅ Development/production environment configuration

## 📖 Documentation

### Sessions

- [Payment Sessions Overview](https://docs.xendit.co/docs/payment-sessions-overview)
- [Session for One-Time Payment](https://docs.xendit.co/docs/payment-1)
- [Session for Saving Payment Method](https://docs.xendit.co/docs/storing-payment-details)
- [Session for Pay and Save](https://docs.xendit.co/docs/pay-and-save-2)
- [Create Session API](https://docs.xendit.co/apidocs/create-session)

### Further Reading

- [Xendit Docs](https://docs.xendit.co/)
- [Xendit API Reference](https://developers.xendit.co/)

---

_This demo application is designed to help developers understand and implement Xendit's payment solutions. Use it as a reference for your own integration projects._
