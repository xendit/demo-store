import { useCallback, useState } from "react";
import config from "./config.json";
import data from "../data.json";
import { CheckoutPage } from "./pages/Checkout/Checkout";
import { SuccessPage } from "./pages/Success/Success";
import { StorePage } from "./pages/Store/Store";
import type { CartItem, PageType } from "./types/store";
import { CheckoutIframePage } from "./pages/CheckoutIframe/CheckoutIframe";

const App: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const paymentStatus = queryParams.get("payment_status");
  const tokenRequestId = queryParams.get("token_request_id");
  const checkoutId = queryParams.get("checkout_id");
  const isReturn = !!(tokenRequestId && checkoutId);

  const [currentPage, setCurrentPage] = useState<{
    page: PageType;
    params: Record<string, unknown>;
  }>(
    paymentStatus === "success"
      ? { page: "success", params: {} }
      : isReturn
        ? { page: "checkout", params: { checkoutId, resume: true } }
        : { page: "store", params: {} },
  );

  const [selectedCurrency, setSelectedCurrency] = useState<string>("IDR");
  const [selectedFlow, setSelectedFlow] = useState(config.flows[0]);
  const [selectedIntegration, setSelectedIntegration] = useState(
    config.integrations[0],
  );

  const [cart, setCart] = useState<CartItem[]>([
    { id: data.products[0].id, quantity: 1 },
  ]);

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
      if (page === "store" && window.location.search) {
        window.history.replaceState(null, "", window.location.pathname);
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
          componentsKey={currentPage.params.componentsKey as string | undefined}
          checkoutId={currentPage.params.checkoutId as string | undefined}
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
