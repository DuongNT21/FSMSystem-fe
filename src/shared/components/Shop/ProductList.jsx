import React from "react";
import "./ProductList.css";

const ProductCard = ({ bouquet, loadingStrategy }) => {
  // Safely extract first image
  const imagePath = bouquet.images?.length > 0 ? bouquet.images[0].image : null;

  const imageSrc = imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `https://res.cloudinary.com/di3ruboxo/image/upload/${imagePath}`
    : "https://placehold.co/400?text=No+Image"; // Fallback placeholder

  return (
    <div className="product-card">
      <img
        src={imageSrc}
        alt={bouquet.name}
        className="product-image"
        loading={loadingStrategy}
      />

      <h3 className="product-name">{bouquet.name}</h3>
      <h3 className="product-description">{bouquet.description}</h3>

      <p className="product-price">
        {Number(bouquet.price).toLocaleString()} VND
      </p>
    </div>
  );
};

export const ProductList = ({ bouquets = [] }) => {
  if (!bouquets.length) {
    return <p>No bouquets available</p>;
  }

  return (
    <div className="product-grid">
      {bouquets.map((item, index) => {
        const bouquet = item.bouquet ?? item;
        const loadingStrategy = index < 4 ? "eager" : "lazy";

        return (
          <ProductCard
            key={bouquet.id}
            bouquet={bouquet}
            loadingStrategy={loadingStrategy}
          />
        );
      })}
    </div>
  );
};
