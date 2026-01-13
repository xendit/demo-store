type Config = {
  apiKeyByCurrency: { [currency: string]: string | undefined };
  countryByCurrency: { [currency: string]: string };
  origin: string;
  successUrl: string;
};

const appUrl = process.env.APP_URL || "http://localhost:5173";

const config: Config = {
  apiKeyByCurrency: {
    IDR: process.env.IDR_API_KEY,
    PHP: process.env.PHP_API_KEY,
    MYR: process.env.MYR_API_KEY,
    THB: process.env.THB_API_KEY,
    VND: process.env.VND_API_KEY,
    SGD: process.env.SGD_API_KEY,
  },
  countryByCurrency: {
    IDR: "ID",
    PHP: "PH",
    MYR: "MY",
    THB: "TH",
    VND: "VN",
    SGD: "SG",
  },
  origin: appUrl,
  successUrl: appUrl + "?payment_status=success",
};

export default config;
