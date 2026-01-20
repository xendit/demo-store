import data from "../../../data.json";
import config from "../../config.json";
import ArrowLeft from "../../icons/ArrowLeft";
import { XenditComponentsPayment } from "../../integrations/XenditComponents";
import type { CartItem as CartItemType, PageType } from "../../types/store";
import { Column, Columns, Container, Page } from "../../ui/Layout/Layout";
import classes from "./style.module.css";

const PRODUCTS = data.products;
const EXCHANGE_RATES = data.exchangeRates as Record<string, number>;

export const CheckoutPage: React.FC<{
  goToPage: (page: PageType) => void;
  cart: CartItemType[];
  selectedCurrency: string;
  selectedFlow: (typeof config.flows)[number];
  selectedIntegration: (typeof config.integrations)[number];
  componentsKey: string;
}> = ({
  goToPage,
  cart,
  selectedCurrency,
  selectedFlow,
  selectedIntegration,
  componentsKey,
}) => {
  return (
    <div>
      <Page>
        <Container>
          <Columns>
            <Column>
              <button
                className={classes.backToStoreButton}
                onClick={() => goToPage("store")}
              >
                <ArrowLeft width={16} height={16} />
                Back
              </button>
              <h1 className={classes.checkoutTitle}>
                {selectedFlow.value === "save"
                  ? "Add Payment Method"
                  : "Complete Your Payment"}
              </h1>
              <XenditComponentsPayment
                onSuccess={() => {
                  window.location.assign(
                    `/?payment_status=success&flow=${selectedFlow.value}&integration=${selectedIntegration.value}`,
                  );
                }}
                onFail={(message) => {
                  alert(`Error: ${message}`);
                  goToPage("store");
                }}
                componentsKey={componentsKey}
                flow={selectedFlow.value}
              />
            </Column>
            {selectedFlow.value !== "save" ? (
              <Column>
                <div className={classes.orderSummaryBox}>
                  <div className={classes.orderSummary}>
                    <img
                      className={classes.orderSummaryLogo}
                      src="/assets/logo-small.svg"
                    />
                    <h2 className={classes.orderSummaryTitle}>
                      Your order summary
                    </h2>
                    <p className={classes.orderRef}>test-order-00001122025</p>
                  </div>
                  <div className={classes.orderLineItems}>
                    <div className={classes.cartItems}>
                      {cart.map((item, index) => (
                        <CartItem
                          key={index}
                          item={item}
                          currency={selectedCurrency}
                        />
                      ))}
                    </div>
                    <div className={classes.dottedLine} />
                    <div className={classes.total}>
                      <div className={classes.lineItem}>
                        <span className={classes.lineItemName}>Total</span>
                        <span className={classes.lineItemPrice}>
                          {Xendit.XenditComponents.amountFormat(
                            cart.reduce(
                              (total, item) =>
                                total +
                                PRODUCTS[item.id].price *
                                  EXCHANGE_RATES[selectedCurrency] *
                                  item.quantity,
                              0,
                            ),
                            selectedCurrency,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={classes.termsOfService}>
                    <p>
                      This is a demonstration of the Xendit Components SDK. No
                      actual payment will be processed.
                    </p>
                  </div>
                </div>
              </Column>
            ) : null}
          </Columns>
        </Container>
      </Page>
    </div>
  );
};

const CartItem: React.FC<{ item: CartItemType; currency: string }> = ({
  item,
  currency,
}) => {
  const product = PRODUCTS[item.id];
  const exchangeRate = EXCHANGE_RATES[currency];

  const subtotal = product.price * exchangeRate * item.quantity;
  return (
    <div className={classes.lineItem}>
      <span className={classes.lineItemName}>
        {item.quantity !== 1
          ? `${product.title} ✕ ${item.quantity}`
          : product.title}
      </span>
      <span className={classes.lineItemPrice}>
        {Xendit.XenditComponents.amountFormat(subtotal, currency)}
      </span>
    </div>
  );
};
