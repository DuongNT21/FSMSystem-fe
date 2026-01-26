import React from "react";
import "./ProductList.css";

export const ProductList = ({ bouquets = [] }) => {
  if (!bouquets.length) {
    return <p>No bouquets available</p>;
  }

  return (
    <div className="product-grid">
      {bouquets.map((item) => {
        const bouquet = item.bouquet ?? item;

        // Safely extract first image
        const base64Image =
          bouquet.images?.length > 0
            ? bouquet.images[0].image
            : null;

        const imageSrc = base64Image
          ? base64Image.startsWith("data:")
            ? base64Image
            : `data:image/jpeg;base64,${base64Image}`
          : "/placeholder.jpg"; // optional fallback

        return (
          <div key={bouquet.id} className="product-card">
            <img
              src={imageSrc}
              alt={bouquet.name}
              className="product-image"
              loading="lazy"
            />

            <h3 className="product-name">{bouquet.name}</h3>

            <p className="product-price">
              {Number(bouquet.price).toLocaleString()} VND
            </p>
          </div>
        );
      })}
    </div>
  );
};
