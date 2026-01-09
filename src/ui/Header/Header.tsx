import { useRef } from "react";
import data from "../../../data.json";
import { Container } from "../Layout/Layout";
import classes from "./style.module.css";

const CURRENCY_LABELS: {
  [currency: string]: { symbol: string; country: string };
} = {
  IDR: { symbol: "IDR Rp", country: "Indonesia" },
  PHP: { symbol: "PHP ₱", country: "Philippines" },
  THB: { symbol: "THB ฿", country: "Thailand" },
  SGD: { symbol: "SGD $", country: "Singapore" },
  VND: { symbol: "VND ₫", country: "Vietnam" },
};

export const Header: React.FC<{
  selectedCurrency?: string;
  onChangeCurrency?: (currency: string) => void;
}> = ({ selectedCurrency, onChangeCurrency }) => {
  const currencyButtonRef = useRef<HTMLDivElement>(null);

  const currencies = Object.keys(data.exchangeRates);
  const currencyLabel = selectedCurrency
    ? CURRENCY_LABELS[selectedCurrency] || {
        symbol: selectedCurrency,
        country: "",
      }
    : { symbol: "", country: "" };

  return (
    <div className={classes.header}>
      <Container>
        <div className={classes.headerInner}>
          <img className={classes.headerLogo} src="/assets/logo-small.svg" />
          <div className={classes.headerControls}>
            {onChangeCurrency ? (
              <div>
                <button
                  className={classes.currencyPicker}
                  popoverTarget="currency-picker-popover"
                >
                  <span className={classes.selectedCurrency}>
                    <span className={classes.selectedCurrencySymbol}>
                      {currencyLabel.symbol}
                    </span>{" "}
                    <span className={classes.selectedCurrencyCountry}>
                      &bull; {currencyLabel.country}
                    </span>
                  </span>
                  <img src="/assets/caret.svg" />
                </button>
                <div
                  id="currency-picker-popover"
                  className={classes.currencyPickerPopover}
                  popover="auto"
                  ref={currencyButtonRef}
                >
                  {currencies.map((currency, i) => (
                    <button
                      key={i}
                      className={classes.currencyOption}
                      onClick={() => {
                        onChangeCurrency(currency);
                        currencyButtonRef.current?.hidePopover();
                      }}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
};
