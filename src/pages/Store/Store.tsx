import { useCallback, useMemo, useState } from "react";
import data from "../../../data.json";
import config from "../../config.json";
import ArrowRight from "../../icons/ArrowRight";
import {
  type CartItem as CartItemType,
  type PageType,
  type Product,
} from "../../types/store";
import { ButtonLoadingSpinner } from "../../ui/Button/Button";
import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import {
  Column,
  Columns,
  Container,
  Page,
  WideColumn,
} from "../../ui/Layout/Layout";
import { ProductsList } from "../../ui/Products/Products";
import { Toasts } from "../../ui/Toasts/Toasts";
import { IntegrationsBar } from "./IntegrationsBar";
import classes from "./style.module.css";

const PRODUCTS: Product[] = data.products;

export const StorePage: React.FC<{
  selectedCurrency: string;
  onChangeCurrency: (currency: string) => void;
  selectedFlow: (typeof config.flows)[number];
  onChangeFlow: (flow: (typeof config.flows)[number]) => void;
  cart: CartItemType[];
  onAddToCart: (productId: number) => void;
  goToPage: (page: PageType) => void;
}> = ({
  selectedCurrency,
  onChangeCurrency,
  selectedFlow,
  onChangeFlow,
  cart,
  onAddToCart,
  goToPage,
}) => {
  const [checkingOut, setCheckingOut] = useState(false);
  const [toasts, setToasts] = useState<string[]>([]);

  const featuredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => product.isFeatured);
  }, []);

  // STUB: Simulates checkout - just goes to success page after a delay
  const onCheckout = useCallback(async () => {
    setCheckingOut(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCheckingOut(false);
    goToPage("success");
  }, [goToPage]);

  const handleAddToCart = useCallback(
    (productId: number) => {
      if (checkingOut) {
        return;
      }
      if (selectedFlow.omitsItems) {
        return;
      }
      onAddToCart(productId);
      setToasts((prevToasts) => [
        ...prevToasts,
        `${PRODUCTS.find((p) => p.id === productId)?.title} added to your cart!`,
      ]);
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.slice(1));
      }, 5000);
    },
    [onAddToCart, checkingOut, selectedFlow],
  );

  const featuredProductsSectionClasses = [
    classes.section,
    classes.featuredSection,
  ];
  const allProductsSectionClasses = [classes.section];
  if (selectedFlow.omitsItems) {
    featuredProductsSectionClasses.push(classes.disabledSection);
    allProductsSectionClasses.push(classes.disabledSection);
  }

  return (
    <div>
      <Header
        selectedCurrency={selectedCurrency}
        onChangeCurrency={onChangeCurrency}
      />
      <StoreCard fullWidth />
      <Page>
        <Container>
          <Columns>
            <Column>
              <StoreCard />
            </Column>
            <WideColumn>
              <IntegrationsBar
                cart={cart}
                checkingOut={checkingOut}
                onCheckout={onCheckout}
                selectedFlow={selectedFlow}
                onChangeFlow={onChangeFlow}
              />

              {selectedFlow.omitsItems ? (
                <div className={classes.addPaymentMethodCallout}>
                  <span className={classes.addPaymentMethodText}>
                    Add a payment method for faster checkout later
                  </span>

                  <button
                    type="button"
                    className={classes.addPaymentMethodButton}
                    disabled={checkingOut}
                    onClick={onCheckout}
                  >
                    Add Payment Method{" "}
                    {checkingOut ? (
                      <ButtonLoadingSpinner />
                    ) : (
                      <ArrowRight width={16} height={16} />
                    )}
                  </button>
                </div>
              ) : null}

              <section className={featuredProductsSectionClasses.join(" ")}>
                <h1 className={classes.storeTitle}>Our Featured Plushxie!</h1>
                <ProductsList
                  currency={selectedCurrency}
                  products={featuredProducts}
                  onAddToCart={handleAddToCart}
                  featured
                  disabled={selectedFlow.omitsItems}
                />
              </section>

              <section className={allProductsSectionClasses.join(" ")}>
                <h1 className={classes.storeTitle}>All Plushxie</h1>
                <ProductsList
                  currency={selectedCurrency}
                  products={PRODUCTS}
                  onAddToCart={handleAddToCart}
                  disabled={selectedFlow.omitsItems}
                />
              </section>
            </WideColumn>
          </Columns>
        </Container>
      </Page>
      <Footer />

      <Toasts toasts={toasts} />
    </div>
  );
};

const StoreCard: React.FC<{
  fullWidth?: boolean;
}> = ({ fullWidth }) => {
  const containerClasses = [classes.storeCard];
  if (fullWidth) {
    containerClasses.push(classes.storeCardFullWidth);
  }

  return (
    <div className={containerClasses.join(" ")}>
      <div className={classes.storeLogoContainer}>
        <img className={classes.storeLogo} src="/assets/logo-hero.svg" />
      </div>
      <h2 className={classes.storeCardSubtitle}>Official Plushie Store</h2>
      <p className={classes.storeCardDescription}>
        Welcome to Plushxie! <br />
        We're bringing the cutest badgers straight from Blok M.
      </p>
      <div className={classes.dottedLine}></div>
      <p className={classes.storeCardDisclaimer}>
        This is a <strong>demo store</strong> for testing purposes only.{" "}
        <strong>No real transactions will be processed.</strong>
      </p>
    </div>
  );
};
