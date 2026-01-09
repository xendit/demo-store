import { useCallback, useState } from "react";
import config from "./config.json";
import data from "../data.json";
import { CheckoutPage } from "./pages/Checkout/Checkout";
import { PaymentSuccessPage } from "./pages/PaymentSuccess/PaymentSuccess";
import { StorePage } from "./pages/Store/Store";
import type { CartItem, PageType } from "./types/store";

const App: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const paymentStatus = queryParams.get("payment_status");

  const [currentPage, setCurrentPage] = useState<{
    page: PageType;
    params: Record<string, unknown>;
  }>(
    paymentStatus === "success"
      ? { page: "payment-success", params: {} }
      : { page: "store", params: {} }
  );

  const [selectedCurrency, setSelectedCurrency] = useState<string>("IDR");
  const [selectedFlow, setSelectedFlow] = useState(config.flows[0]);
  const [selectedIntegration, setSelectedIntegration] = useState(
    config.integrations[0]
  );

  const [cart, setCart] = useState<CartItem[]>([
    { id: data.products[0].id, quantity: 1 },
  ]);

  const addToCart = useCallback((productId: number) => {
    setCart((prev) => {
      const clone = [...prev];
      const existingItemIndex = clone.findIndex(
        (item) => item.id === productId
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
      setCurrentPage({ page, params });
    },
    []
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
          componentsKey={currentPage.params.componentsKey as string}
        />
      );
    case "payment-success":
      return <PaymentSuccessPage />;
    default:
      return null;
  }
};

export default App;
