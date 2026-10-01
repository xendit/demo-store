import { useLayoutEffect, useRef } from "react";
import { XenditComponents, XenditFatalErrorEvent } from "xendit-components-web";

export const XenditComponentsQrOnly: React.FC<{
  onSuccess: () => void;
  onFail: (message: string) => void;
  onEnd: () => void;
  componentsKey: string;
}> = ({ onSuccess, onFail, onEnd, componentsKey }) => {
  const sdkRef = useRef<XenditComponents | null>(null);
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    // Reuse existing SDK instance if available (handles strict mode double-mount)
    if (sdkRef.current) {
      return;
    }

    const sdk = new XenditComponents({
      componentsSdkKey: componentsKey,
    });
    sdkRef.current = sdk;

    sdk.addEventListener("init", () => {
      const qrChannels = sdk.getActiveChannels({
        filter: ["QRIS", "SGQR", "PROMPTPAY", "DUITNOW_QR"],
      });

      if (qrChannels.length === 0) {
        onFail("QR payment channel is not available for this session");
        return;
      }

      sdk.setCurrentChannel(qrChannels[0]);

      // cannot call submit inside init
      submitTimeoutRef.current = setTimeout(() => {
        sdk.submit();
      }, 0);
    });

    sdk.addEventListener("session-complete", onSuccess);

    sdk.addEventListener("fatal-error", (event: XenditFatalErrorEvent) => {
      onFail(event.message);
    });

    sdk.addEventListener("submission-end", () => {
      onEnd();
    });

    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, [componentsKey, onFail, onSuccess, onEnd]);

  // No UI rendered - SDK handles everything
  return null;
};
