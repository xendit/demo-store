# Demo Store

A demonstration e-commerce store showcasing payment integration patterns.

## Quick Start

### Prerequisites

- Node.js 18+
- API key(s) from your payment provider for your target markets

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd demo-store
   ```

2. **Configure environment**
   Create a `.env` file with your payment provider API keys:

   ```env
   IDR_API_KEY=your_api_key_here
   PHP_API_KEY=your_api_key_here
   # Add keys for other currencies as needed
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Project Structure

- `src/` - Frontend React application
- `server/` - Backend Express server
- `src/integrations/` - Payment integration components (currently stubbed)

## Replacing Stubs

The payment integrations are currently stubbed out. To integrate with a real payment provider:

1. Update `server/integrations/` files with actual API calls
2. Replace `src/integrations/PaymentComponents.tsx` with your provider's SDK
3. Update `server/config.ts` with real API key configuration

See `src/integrations/README.md` for more details on the integration pattern.
