import { useMemo, useRef } from "react";
import config from "../../config.json";
import ArrowSquareOut from "../../icons/ArrowSquareOut";
import Caret from "../../icons/Caret";
import Cart from "../../icons/Cart";
import type { CartItem as CartItemType } from "../../types/store";
import { ButtonLoadingSpinner } from "../../ui/Button/Button";
import classes from "./style.module.css";

export const IntegrationsBar: React.FC<{
  cart: CartItemType[];
  checkingOut: boolean;
  onCheckout: () => void;
  selectedFlow: (typeof config.flows)[number];
  onChangeFlow: (flow: (typeof config.flows)[number]) => void;
  selectedIntegration: (typeof config.integrations)[number];
  onChangeIntegration: (
    integration: (typeof config.integrations)[number]
  ) => void;
}> = (props) => {
  const {
    cart,
    checkingOut,
    onCheckout,
    selectedFlow,
    onChangeFlow,
    selectedIntegration,
    onChangeIntegration,
  } = props;
  const flowPopoverRef = useRef<HTMLDivElement>(null);
  const integrationButtonRef = useRef<HTMLDivElement>(null);

  const docsLink = useMemo(() => {
    const link = config.docsLinks.find(
      (link) =>
        link.flow === selectedFlow.value &&
        link.integration === selectedIntegration.value
    );
    return link?.url;
  }, [selectedFlow, selectedIntegration]);

  const handleSelectFlow = (flow: (typeof config.flows)[number]) => {
    onChangeFlow(flow);
    if (selectedIntegration.supportsFlows.indexOf(flow.value) === -1) {
      const compatibleIntegration = config.integrations.find((integration) =>
        integration.supportsFlows.includes(flow.value)
      );
      if (compatibleIntegration) {
        onChangeIntegration(compatibleIntegration);
      }
    }
  };

  return (
    <div className={classes.integrationsBar}>
      <div className={classes.integrationsBarHeading}>
        Demo integrations of:
      </div>
      <div className={classes.integrationsBarContent}>
        <div className={classes.integrationsBarControls}>
          <div>
            <button
              className={classes.flowPicker}
              popoverTarget="flow-picker-popover"
            >
              {selectedFlow.title} flow
              <Caret />
            </button>
            <div
              id="flow-picker-popover"
              className={[
                classes.flowPickerPopover,
                classes.pickerPopover,
              ].join(" ")}
              popover="auto"
              ref={flowPopoverRef}
            >
              {config.flows.map((flow) => (
                <button
                  key={flow.value}
                  disabled={flow.disabled}
                  className={classes.popoverOption}
                  onClick={() => {
                    handleSelectFlow(flow);
                    flowPopoverRef.current?.hidePopover();
                  }}
                >
                  <div className={classes.popoverOptionTitle}>{flow.title}</div>
                  <div className={classes.popoverOptionDescription}>
                    {flow.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
          using
          <div>
            <button
              className={classes.integrationPicker}
              popoverTarget="integration-picker-popover"
            >
              {selectedIntegration.title}
              <Caret />
            </button>
            <div
              id="integration-picker-popover"
              className={[
                classes.integrationPickerPopover,
                classes.pickerPopover,
              ].join(" ")}
              popover="auto"
              ref={integrationButtonRef}
            >
              {config.integrations.map((integration) => (
                <button
                  key={integration.value}
                  className={classes.popoverOption}
                  disabled={
                    integration.supportsFlows.indexOf(selectedFlow.value) === -1
                  }
                  onClick={() => {
                    onChangeIntegration(integration);
                    integrationButtonRef.current?.hidePopover();
                  }}
                >
                  <div className={classes.popoverOptionTitle}>
                    {integration.title}
                  </div>
                  <div className={classes.popoverOptionDescription}>
                    {integration.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {!selectedFlow.omitsItems ? (
          <button
            disabled={cart.length === 0 || checkingOut}
            title="Add items to your cart before checking out"
            className={classes.checkoutButton}
            onClick={() => onCheckout()}
          >
            {checkingOut ? <ButtonLoadingSpinner /> : <Cart />}
            <span>Checkout</span>

            <span className={classes.cartItemCount}>
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </button>
        ) : null}
      </div>

      {docsLink ? (
        <div className={classes.integrationDocs}>
          <a href={docsLink} target="_blank" rel="noreferrer">
            Read more about this integration <ArrowSquareOut />
          </a>
        </div>
      ) : null}
    </div>
  );
};
