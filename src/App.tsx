import { useCallback, useState } from "react";
import config from "./config.json";
import data from "../data.json";
import { SuccessPage } from "./pages/Success/Success";
import { StorePage } from "./pages/Store/Store";
import { type CartItem, type PageType } from "./types/store";

const App: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const paymentStatus = queryParams.get("payment_status");

  const [currentPage, setCurrentPage] = useState<PageType>(
    paymentStatus === "success" ? "success" : "store",
  );

  const [selectedCurrency, setSelectedCurrency] = useState<string>("IDR");
  const [selectedFlow, setSelectedFlow] = useState(config.flows[0]);

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

  const goToPage = useCallback((page: PageType) => {
    if (page === "store") {
      if (window.location.search) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
    setCurrentPage(page);
  }, []);

  switch (currentPage) {
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
        />
      );
    case "success":
      return <SuccessPage />;
    default:
      return null;
  }
};

export default App;
