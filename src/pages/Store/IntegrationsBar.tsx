import { useRef } from "react";
import config from "../../config.json";
import Caret from "../../icons/Caret";
import Cart from "../../icons/Cart";
import type { CartItem as CartItemType } from "../../types/store";
import { Button, ButtonLoadingSpinner } from "../../ui/Button/Button";
import classes from "./style.module.css";

export const IntegrationsBar: React.FC<{
  cart: CartItemType[];
  checkingOut: boolean;
  onCheckout: () => void;
  selectedFlow: (typeof config.flows)[number];
  onChangeFlow: (flow: (typeof config.flows)[number]) => void;
}> = (props) => {
  const { cart, checkingOut, onCheckout, selectedFlow, onChangeFlow } = props;
  const flowPopoverRef = useRef<HTMLDivElement>(null);

  return (
    <div className={classes.integrationsBar}>
      <div className={classes.integrationsBarHeading}>
        Demo integrations of:
      </div>
      <div className={classes.integrationsBarContent}>
        <div className={classes.integrationsBarControls}>
          <div>
            <Button
              variant="secondary"
              className={classes.flowPicker}
              popoverTarget="flow-picker-popover"
            >
              {selectedFlow.title} flow
              <Caret />
            </Button>
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
                  className={classes.popoverOption}
                  onClick={() => {
                    onChangeFlow(flow);
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
        </div>

        {!selectedFlow.omitsItems ? (
          <Button
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
          </Button>
        ) : null}
      </div>
    </div>
  );
};
