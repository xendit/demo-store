import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { XenditComponents, XenditFatalErrorEvent } from "xendit-components-web";
import type { Flow } from "../types/store";
import { Button } from "../ui/Button/Button.js";
import classes from "./style.module.css";

const SUBMIT_LABELS: Record<Flow, string> = {
  pay: "Simulate Payment",
  save: "Simulate Save Payment Method",
  pay_save: "Simulate Payment",
  subscription: "Simulate Subscription",
};

export const XenditComponentsPayment: React.FC<{
  onSuccess: () => void;
  onFail: (message: string) => void;
  componentsKey: string;
  flow: Flow;
  resume?: boolean;
}> = ({ onSuccess, onFail, componentsKey, flow, resume }) => {
  const el = useRef<HTMLDivElement | null>(null);
  const sdkRef = useRef<XenditComponents | null>(null);

  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useLayoutEffect(() => {
    const sdk = new XenditComponents({
      componentsSdkKey: componentsKey,
      resume: resume,
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

    const channelPicker = sdk.createChannelPickerComponent();
    el.current?.replaceChildren(channelPicker);

    sdk.addEventListener("init", () => {
      setLoading(false);
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
    sdk.addEventListener("submission-resume", () => {
      setSubmitting(true);
    });
    sdk.addEventListener("submission-end", (event) => {
      setSubmitting(false);

      const { userErrorMessage } = event;
      if (userErrorMessage) {
        alert(userErrorMessage.join("\n"));
      }
    });

    return () => {
      sdkRef.current?.destroyComponent(channelPicker);
    };
  }, [componentsKey, resume]);

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
      <div
        className={`${classes.xenditComponentContainer} ${loading || submitting ? classes.xenditComponentContainerDisabled : ""}`}
        ref={el}
      ></div>
      {!loading ? (
        <Button
          onClick={onSubmit}
          className={!ready ? classes.submitButtonDisabled : undefined}
        >
          {SUBMIT_LABELS[flow]}
        </Button>
      ) : null}
      {loading || submitting ? (
        <div className={classes.loading}>
          <div className={classes.loadingSpinner}></div>
        </div>
      ) : null}
    </div>
  );
};
