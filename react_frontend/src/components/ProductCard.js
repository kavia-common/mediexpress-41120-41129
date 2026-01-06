import React from "react";
import Badge from "./Badge";
import Button from "./Button";
import { useCart } from "../context/CartContext";

// PUBLIC_INTERFACE
export default function ProductCard({ product }) {
  /** Product listing card with image, description, availability, and add-to-cart. */
  const { addItem } = useCart();
  const isAvailable = product.availability !== "Out of Stock";

  const badgeTone =
    product.availability === "In Stock"
      ? "success"
      : product.availability === "Out of Stock"
        ? "error"
        : "neutral";

  return (
    <article className="card">
      <div className="cardMedia">
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
      </div>

      <div className="cardBody">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
          <h3 className="cardTitle">{product.name}</h3>
          <Badge tone={badgeTone}>{product.availability}</Badge>
        </div>

        <p className="cardDesc">{product.description}</p>

        <div className="cardMetaRow">
          <div className="price">${product.price.toFixed(2)}</div>
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
