import React, { useMemo, useState } from "react";
import Badge from "./Badge";
import Button from "./Button";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { formatInr, formatUsd } from "../utils/currency";
import { getPrimaryInrPrice, getSecondaryUsdPrice } from "../utils/pricing";
import { FALLBACK_MEDICINE_IMAGE } from "../data/medicines";

function getProductImageSrc(product) {
  // Prefer the new `image` field, fall back to legacy `imageUrl`, then fallback asset.
  return product?.image || product?.imageUrl || FALLBACK_MEDICINE_IMAGE;
}

// PUBLIC_INTERFACE
export default function ProductCard({ product, onAddedToCart }) {
  /**
   * Product listing card.
   * UX: clicking the card adds to cart (when available) and opens the cart drawer.
   * Accessibility: card is keyboard-activatable via Enter/Space.
   */
  const { addItem } = useCart();
  const { rate } = useCurrency();

  const isAvailable = product.availability !== "Out of Stock";

  const badgeTone =
    product.availability === "In Stock"
      ? "success"
      : product.availability === "Out of Stock"
        ? "error"
        : "neutral";

  const inrPrice = getPrimaryInrPrice(product, rate);
  const usdPrice = getSecondaryUsdPrice(product, rate);

  const initialSrc = useMemo(() => getProductImageSrc(product), [product]);
  const [imgSrc, setImgSrc] = useState(initialSrc);

  const addAndOpenCart = () => {
    if (!isAvailable) return;
    addItem(product);
    onAddedToCart?.();
  };

  return (
    <article
      className="card"
      role="button"
      tabIndex={isAvailable ? 0 : -1}
      aria-disabled={!isAvailable}
      aria-label={isAvailable ? `Add ${product.name} to cart` : `${product.name} unavailable`}
      onClick={() => addAndOpenCart()}
      onKeyDown={(e) => {
        // Activate on Enter/Space, like a button.
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          addAndOpenCart();
        }
      }}
    >
      <div className="cardMedia" aria-label={`${product.name} image`}>
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onError={() => {
            // If a specific image fails, fall back to our clean generic placeholder.
            if (imgSrc !== FALLBACK_MEDICINE_IMAGE) setImgSrc(FALLBACK_MEDICINE_IMAGE);
          }}
        />
      </div>

      <div className="cardBody">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
          <h3 className="cardTitle">{product.name}</h3>
          <Badge tone={badgeTone}>{product.availability}</Badge>
        </div>

        <p className="cardDesc">{product.description}</p>

        <div className="cardMetaRow">
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <div className="price">{formatInr(inrPrice)}</div>
            <div className="priceSecondary">({formatUsd(usdPrice)} USD)</div>
          </div>

          <Button
            variant={isAvailable ? "primary" : "ghost"}
            type="button"
            disabled={!isAvailable}
            aria-disabled={!isAvailable}
            aria-label={isAvailable ? `Add ${product.name} to cart` : `${product.name} unavailable`}
            onClick={(e) => {
              // Prevent the article click handler from firing twice.
              e.stopPropagation();
              addAndOpenCart();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {isAvailable ? "Add to cart" : "Unavailable"}
          </Button>
        </div>
      </div>
    </article>
  );
}
