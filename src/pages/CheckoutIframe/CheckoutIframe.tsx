import config from "../../config.json";
import ArrowLeft from "../../icons/ArrowLeft";
import type { PageType } from "../../types/store";
import { Container, Page } from "../../ui/Layout/Layout";
import classes from "./style.module.css";

/**
 * The demo store loads payment links in an iframe if you add the query string `?payment-link-iframe`.
 *
 * Loading our payment link page in an iframe is not recommeded. Prefer to use Xendit Components if possible.
 *
 * If you do use an iframe, ensure you add:
 * ```
 * allow="payment"
 * sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation"
 * ```
 *
 * allow-scripts and allow-same-origin are required for the payment link page to load.
 * allow-popups and allow-forms are required for Google Pay.
 * allow="payment" is required for Google Pay and Apple Pay.
 * allow-top-navigation is required for us to redirect customers to your return URLs, and for us to redirect customers to partners who's pages won't load in an iframe.
 */
export const CheckoutIframePage: React.FC<{
  goToPage: (page: PageType) => void;
  selectedFlow: (typeof config.flows)[number];
  paymentLinkUrl: string;
}> = ({ goToPage, selectedFlow, paymentLinkUrl }) => {
  return (
    <Page>
      <Container>
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
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
          <iframe
            allow="payment"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation"
            src={paymentLinkUrl}
            height="800"
          />
        </div>
      </Container>
    </Page>
  );
};
