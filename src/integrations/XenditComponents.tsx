import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type {
  XenditComponents,
  XenditFatalErrorEvent,
} from "./xendit-components.js";
import { Button } from "../ui/Button/Button.js";
import classes from "./style.module.css";

export const XenditComponentsPayment: React.FC<{
  onSuccess: () => void;
  onFail: (message: string) => void;
  componentsKey: string;
}> = ({ onSuccess, onFail, componentsKey }) => {
  const el = useRef<HTMLDivElement | null>(null);
  const sdkRef = useRef<XenditComponents | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useLayoutEffect(() => {
    const sdk = new XenditSdk.XenditComponents({
      sessionClientKey: componentsKey,
    });
    sdkRef.current = sdk;

    let cardsComponent: HTMLElement | null = null;

    sdk.addEventListener("init", () => {
      setLoading(false);
      const cards = sdk
        .getActiveChannels()
        .find((channel) => channel.channelCode === "CARDS");
      if (cards) {
        cardsComponent = sdk.createChannelComponent(cards);
        el.current?.replaceChildren(cardsComponent);
      }
    });

    sdk.addEventListener("submission-begin", () => {
      setSubmitting(true);
    });
    sdk.addEventListener("submission-end", () => {
      setSubmitting(false);
    });

    return () => {
      if (cardsComponent) {
        sdkRef.current?.destroyComponent(cardsComponent);
      }
    };
  }, [componentsKey]);

  useLayoutEffect(() => {
    if (!sdkRef.current) return;

    sdkRef.current?.addEventListener("session-complete", onSuccess);
    return () => {
      sdkRef.current?.removeEventListener("session-complete", onSuccess);
    };
  }, [onSuccess]);

  useLayoutEffect(() => {
    if (!sdkRef.current) return;

    function handleError(event: XenditFatalErrorEvent) {
      onFail(event.message);
    }

    sdkRef.current?.addEventListener("fatal-error", handleError);
    return () => {
      sdkRef.current?.removeEventListener("fatal-error", handleError);
    };
  }, [onFail]);

  const onSubmit = useCallback(() => {
    sdkRef.current?.submit();
  }, []);

  return (
    <div className={classes.paymentContainer}>
      <div className={classes.xenditComponentContainer} ref={el}></div>
      <Button onClick={onSubmit}>Submit Simulated Payment</Button>
      {loading || submitting ? (
        <div className={classes.loading}>
          <div className={classes.loadingSpinner}></div>
        </div>
      ) : null}
    </div>
  );
};
