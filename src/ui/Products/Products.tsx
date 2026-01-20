import type { FC } from "react";
import { useMemo } from "react";
import data from "../../../data.json";
import type { Product } from "../../types/store";
import classes from "./style.module.css";

const EXCHANGE_RATES: { [currency: string]: number } = data.exchangeRates;

export const ProductsList: FC<{
  products: Product[];
  featured?: boolean;
  currency: string;
  onAddToCart: (productId: number) => void;
  disabled?: boolean;
}> = ({ products, featured, currency, onAddToCart, disabled }) => {
  const renderProductItem = (product: Product) => {
    const price = product.price * EXCHANGE_RATES[currency];

    return (
      <ProductItem
        key={product.id}
        productId={product.id}
        product={{ ...product, price }}
        onAddToCart={onAddToCart}
        currency={currency}
        price={price}
        disabled={disabled}
      />
    );
  };

  if (featured) {
    return (
      <div className={classes.featuredProducts}>
        {products.map(renderProductItem)}
      </div>
    );
  }

  return (
    <div className={classes.products}>{products.map(renderProductItem)}</div>
  );
};

const ProductItem: React.FC<{
  productId: number;
  product: Product;
  onAddToCart: (productId: number) => void;
  currency: string;
  price: number;
  disabled?: boolean;
}> = ({ productId, product, onAddToCart, currency, price, disabled }) => {
  const [color, rating, reviews] = useMemo(
    () => [
      // eslint-disable-next-line react-hooks/purity
      data.colors[Math.floor(Math.random() * data.colors.length)],
      // eslint-disable-next-line react-hooks/purity
      Math.floor(Math.random() * 3) + 3,
      // eslint-disable-next-line react-hooks/purity
      Math.floor(Math.random() * 100),
    ],
    [],
  );

  return (
    <button
      className={classes.product}
      disabled={disabled || product.isSoldOut}
      onClick={() => onAddToCart(productId)}
    >
      <div
        className={classes.productImageWrapper}
        style={{ backgroundColor: color }}
      >
        <img className={classes.productImage} src={product.image} />
        {product.isSoldOut ? (
          <div className={classes.soldOutBadge}>
            <span>Soldout!</span>
          </div>
        ) : null}
      </div>
      <div className={classes.productDetailsWrapper}>
        <div className={classes.productDetails}>
          <p className={classes.productTitle}>{product.title}</p>
          <p className={classes.productDescription}>{product.description}</p>
          <div className={classes.productRating}>
            {Array.from({ length: rating }).map((_, index) => (
              <img key={index} src="/assets/star.svg" />
            ))}
            ({reviews})
          </div>
        </div>
        <p className={classes.productPrice}>
          {product.isSoldOut
            ? "Sold out!"
            : Xendit.XenditComponents.amountFormat(price, currency)}
        </p>
      </div>
    </button>
  );
};
