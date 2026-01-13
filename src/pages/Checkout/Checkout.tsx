import data from "../../../data.json";
import ArrowLeft from "../../icons/ArrowLeft";
import { XenditComponentsPayment } from "../../integrations/XenditComponents";
import type { CartItem as CartItemType, PageType } from "../../types/store";
import {
  Column,
  Columns,
  Container,
  Page,
  WideColumn,
} from "../../ui/Layout/Layout";
import classes from "./style.module.css";

const PRODUCTS = data.products;
const EXCHANGE_RATES = data.exchangeRates as Record<string, number>;

export const CheckoutPage: React.FC<{
  goToPage: (page: PageType) => void;
  cart: CartItemType[];
  selectedCurrency: string;
  componentsKey: string;
}> = ({ goToPage, cart, selectedCurrency, componentsKey }) => {
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
              <h1 className={classes.checkoutTitle}>Complete Your Payment</h1>
              <XenditComponentsPayment
                onSuccess={() => goToPage("payment-success")}
                onFail={(message) => {
                  alert(`Error: ${message}`);
                  goToPage("store");
                }}
                componentsKey={componentsKey}
              />
            </Column>
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
                        {XenditSdk.XenditComponents.amountFormat(
                          cart.reduce(
                            (total, item) =>
                              total +
                              PRODUCTS[item.id].price *
                                EXCHANGE_RATES[selectedCurrency] *
                                item.quantity,
                            0
                          ),
                          selectedCurrency
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
        {XenditSdk.XenditComponents.amountFormat(subtotal, currency)}
      </span>
    </div>
  );
};
