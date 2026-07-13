import { useCallback, useState } from "react";
import config from "./config.json";
import data from "../data.json";
import { CheckoutPage } from "./pages/Checkout/Checkout";
import { SuccessPage } from "./pages/Success/Success";
import { StorePage } from "./pages/Store/Store";
import {
  CHECKOUT_STORAGE_KEY,
  type CartItem,
  type PageType,
  type StoredCheckout,
} from "./types/store";
import { CheckoutIframePage } from "./pages/CheckoutIframe/CheckoutIframe";

const readStoredCheckout = (): StoredCheckout | null => {
  const stored = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as StoredCheckout;
  } catch {
    return null;
  }
};

const App: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const paymentStatus = queryParams.get("payment_status");

  // Xendit appends token_request_id when it sends the customer back from a redirect payment. the SDK reads it (and component_status) off the URL to resume.
  const isReturn = !!queryParams.get("token_request_id");
  const resumed = isReturn ? readStoredCheckout() : null;

  const [currentPage, setCurrentPage] = useState<{
    page: PageType;
    params: Record<string, unknown>;
  }>(
    paymentStatus === "success"
      ? { page: "success", params: {} }
      : resumed
        ? {
            page: "checkout",
            params: { componentsKey: resumed.componentsKey, resume: true },
          }
        : { page: "store", params: {} },
  );

  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    resumed?.currency ?? "IDR",
  );
  const [selectedFlow, setSelectedFlow] = useState(
    config.flows.find((flow) => flow.value === resumed?.flow) ?? config.flows[0],
  );
  const [selectedIntegration, setSelectedIntegration] = useState(
    config.integrations.find(
      (integration) => integration.value === resumed?.integration,
    ) ?? config.integrations[0],
  );

  const [cart, setCart] = useState<CartItem[]>(
    resumed?.cart ?? [{ id: data.products[0].id, quantity: 1 }],
  );

  const addToCart = useCallback((productId: number) => {
    setCart((prev) => {
      const clone = [...prev];
      const existingItemIndex = clone.findIndex(
        (item) => item.id === productId,
      );
      if (existingItemIndex >= 0) {
        clone[existingItemIndex].quantity += 1;
      } else {
        clone.push({ id: productId, quantity: 1 });
      }
      return clone;
    });
  }, []);

  const goToPage = useCallback(
    (page: PageType, params: Record<string, unknown> = {}) => {
      if (page === "store") {
        sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
        if (window.location.search) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
      setCurrentPage({ page, params });
    },
    [],
  );

  switch (currentPage.page) {
    case "store":
      return (
        <StorePage
          selectedCurrency={selectedCurrency}
          onChangeCurrency={setSelectedCurrency}
          cart={cart}
          onAddToCart={addToCart}
          goToPage={goToPage}
          selectedFlow={selectedFlow}
          onChangeFlow={setSelectedFlow}
          selectedIntegration={selectedIntegration}
          onChangeIntegration={setSelectedIntegration}
        />
      );
    case "checkout":
      return (
        <CheckoutPage
          cart={cart}
          goToPage={goToPage}
          selectedCurrency={selectedCurrency}
          selectedFlow={selectedFlow}
          selectedIntegration={selectedIntegration}
          componentsKey={currentPage.params.componentsKey as string}
          resume={currentPage.params.resume === true}
        />
      );
    case "checkout-iframe":
      return (
        <CheckoutIframePage
          goToPage={goToPage}
          selectedFlow={selectedFlow}
          paymentLinkUrl={currentPage.params.paymentLinkUrl as string}
        />
      );
    case "success":
      return <SuccessPage />;
    default:
      return null;
  }
};

export default App;
