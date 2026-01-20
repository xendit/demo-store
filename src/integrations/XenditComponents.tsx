import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { XenditComponents, XenditFatalErrorEvent } from "xendit-components-web";
import { Button } from "../ui/Button/Button.js";
import classes from "./style.module.css";

export const XenditComponentsPayment: React.FC<{
  onSuccess: () => void;
  onFail: (message: string) => void;
  componentsKey: string;
  flow: string;
}> = ({ onSuccess, onFail, componentsKey, flow }) => {
  const el = useRef<HTMLDivElement | null>(null);
  const sdkRef = useRef<XenditComponents | null>(null);

  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useLayoutEffect(() => {
    const sdk = new XenditComponents({
      componentsSdkKey: componentsKey,
      iframeFieldAppearance: {
        inputStyles: {
          color: "#252525",
          fontFamily: "Inter, sans-serif",
        },
        placeholderStyles: {
          color: "#7d7d7d",
        },
        fontFace: {
          source:
            "url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900')",
          descriptors: {
            display: "swap",
          },
        },
      },
    });
    (window as any).components = sdk;
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

    sdk.addEventListener("submission-ready", () => {
      setReady(true);
    });
    sdk.addEventListener("submission-not-ready", () => {
      setReady(false);
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
      <div className={`${classes.xenditComponentContainer} componentOutline`} ref={el}></div>
      <Button onClick={onSubmit} className={!ready ? classes.submitButtonDisabled : undefined}>
        {flow === "save"
          ? "Simulate Save Payment Method"
          : "Simulate Pay Now"}
      </Button>
      {loading || submitting ? (
        <div className={classes.loading}>
          <div className={classes.loadingSpinner}></div>
        </div>
      ) : null}
    </div>
  );
};
