import { useMemo } from "react";
import config from "../../config.json";
import ArrowSquareOut from "../../icons/ArrowSquareOut";
import { Header } from "../../ui/Header/Header";
import { Container, Page } from "../../ui/Layout/Layout";
import classes from "./style.module.css";

export const SuccessPage: React.FC = () => {
  const searchQuery = new URLSearchParams(window.location.search);
  const flow = searchQuery.get("flow");
  const integration = searchQuery.get("integration");

  const docs = useMemo(() => {
    if (!flow || !integration) {
      return null;
    }

    const selectedFlow = config.flows.find((item) => item.value === flow);
    if (!selectedFlow) {
      return null;
    }
    const selectedIntegration = config.integrations.find(
      (item) => item.value === integration
    );
    if (!selectedIntegration) {
      return null;
    }

    const docsLink = config.docsLinks.find(
      (link) =>
        link.flow === selectedFlow.value &&
        link.integration === selectedIntegration.value
    );
    return {
      flow: selectedFlow.title,
      integration: selectedIntegration.title,
      url: docsLink?.url,
    };
  }, [flow, integration]);

  return (
    <div>
      <Header />
      <Page>
        <Container>
          <div className={classes.content}>
            <div className={classes.card}>
              <div className={classes.cardShadow}></div>
              <div className={classes.cardGradient}></div>
              <img
                className={classes.cardImage}
                src="/assets/success-badger.png"
              />
              <h2 className={classes.cardSubtitle}>
                {flow === "save"
                  ? "Payment Method Added!"
                  : "Payment Successful!"}
              </h2>
              <p className={classes.cardDescription}>
                {flow === "save"
                  ? "Your payment method has been successfully added."
                  : "Thank you for your purchase! Your badger is on his way to his new home 🥰️"}
              </p>
              <a href="/" className={classes.backLink}>
                &larr; Back to Plushxie Store
              </a>
            </div>

            {docs ? (
              <div className={classes.docs}>
                <p className={classes.docsDescription}>
                  You’ve just tested <strong>{docs.flow}</strong> using{" "}
                  <strong>{docs.integration}</strong>
                </p>
                {docs.url ? (
                  <a href={docs.url} className={classes.docsLink}>
                    See Docs <ArrowSquareOut />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </Container>
      </Page>
    </div>
  );
};
