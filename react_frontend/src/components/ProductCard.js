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
export default function ProductCard({ product }) {
  /** Product listing card with image, description, availability, and add-to-cart. */
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

  return (
    <article className="card">
      <div className="cardMedia" aria-label={`${product.name} image`}>
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onError={() => {
            // If a specific image fails, fall back to our clean generic placeholder.
            if (imgSrc !== FALLBACK_MEDICINE_IMAGE) setImgSrc(FALLBACK_MEDICINE_IMAGE);
          }}
          style={{
            borderRadius: 14
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
            <div className="p" style={{ fontSize: 12 }}>
              ({formatUsd(usdPrice)} USD)
            </div>
          </div>

          <Button
            variant={isAvailable ? "primary" : "ghost"}
            type="button"
            disabled={!isAvailable}
            aria-disabled={!isAvailable}
            onClick={() => addItem(product)}
          >
            {isAvailable ? "Add to cart" : "Unavailable"}
          </Button>
        </div>
      </div>
    </article>
  );
}
