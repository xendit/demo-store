import { useMemo } from "react";
import config from "../../config.json";
import ArrowSquareOut from "../../icons/ArrowSquareOut";
import type { Flow } from "../../types/store";
import { Header } from "../../ui/Header/Header";
import { Container, Page } from "../../ui/Layout/Layout";
import classes from "./style.module.css";

const VALID_FLOWS: ReadonlySet<string> = new Set<Flow>([
  "pay",
  "save",
  "pay_save",
  "subscription",
]);

const FLOW_STRINGS: Record<Flow, { title: string; description: string }> = {
  pay: {
    title: "Payment Successful!",
    description:
      "Thank you for your purchase! Your badger is on his way to his new home 🥰️",
  },
  save: {
    title: "Payment Method Added!",
    description: "Your payment method has been successfully added.",
  },
  pay_save: {
    title: "Payment Successful!",
    description:
      "Thank you for your purchase! Your badger is on his way to his new home 🥰️",
  },
  subscription: {
    title: "Subscription Active!",
    description: "Your subscription has been successfully created.",
  },
};

function isValidFlow(value: string | null): value is Flow {
  return value !== null && VALID_FLOWS.has(value);
}

export const SuccessPage: React.FC = () => {
  const searchQuery = new URLSearchParams(window.location.search);
  const rawFlow = searchQuery.get("flow");
  const flow: Flow = isValidFlow(rawFlow) ? rawFlow : "pay";
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
      (item) => item.value === integration,
    );
    if (!selectedIntegration) {
      return null;
    }

    const docsLink = config.docsLinks.find(
      (link) =>
        link.flow === selectedFlow.value &&
        link.integration === selectedIntegration.value,
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
                {FLOW_STRINGS[flow].title}
              </h2>
              <p className={classes.cardDescription}>
                {FLOW_STRINGS[flow].description}
              </p>
              <a href="/" className={classes.backLink}>
                &larr; Back to Plushxie Store
              </a>
            </div>

            {docs ? (
              <div className={classes.docs}>
                <p className={classes.docsDescription}>
                  You've just tested <strong>{docs.flow}</strong> using{" "}
                  <strong>{docs.integration}</strong>
                </p>
                {docs.url ? (
                  <a
                    href={docs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.docsLink}
                  >
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
