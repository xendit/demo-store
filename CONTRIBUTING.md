# Xendit Demo Store

The demo site is hosted at https://demo-store.xendit.co

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

   The server runs on port 8000 and the frontend on port 5173.
