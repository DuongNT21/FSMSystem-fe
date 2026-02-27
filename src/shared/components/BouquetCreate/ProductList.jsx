import React from "react";
import "./ProductList.css";

export const ProductList = ({ bouquets = [], onEdit, onDelete }) => {
  if (!bouquets.length) {
    return <p>No bouquets available</p>;
  }

  return (
    <div className="product-table-wrapper">
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
            <th style={{ padding: "10px" }}>Image</th>
            <th style={{ padding: "10px" }}>Name</th>
            <th style={{ padding: "10px" }}>Description</th>
            <th style={{ padding: "10px" }}>Price</th>
            <th style={{ padding: "10px" }}>Status</th>
            <th style={{ padding: "10px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {bouquets.map((item) => {
            const bouquet = item.bouquet ?? item;
            const imagePath = bouquet.images?.length > 0 ? bouquet.images[0].image : null;

            const imageSrc = imagePath
              ? imagePath.startsWith("http")
                ? imagePath
                : `https://res.cloudinary.com/di3ruboxo/image/upload/${imagePath}`
              : "https://placehold.co/400?text=No+Image";
            console.log("imagepath ", imagePath);
            return (
              <tr
                key={bouquet.id}
                onClick={() => onEdit(bouquet)}
                style={{ borderBottom: "1px solid #eee", cursor: "pointer" }}
              >
                <td style={{ padding: "10px" }}>
                  <img
                    src={imageSrc}
                    alt={bouquet.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                  />
                </td>
                <td style={{ padding: "10px" }}>{bouquet.name}</td>
                <td style={{ padding: "10px" }}>{bouquet.description}</td>
                <td style={{ padding: "10px" }}>
                  {Number(bouquet.price).toLocaleString()} VND
                </td>
                <td style={{ padding: "10px" }}>{bouquet.status === 1 ? "On Sale" : "Stopped"}</td>
                <td style={{ padding: "10px" }}>
                  <button onClick={(e) => { e.stopPropagation(); onEdit(bouquet); }}>Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(bouquet.id); }} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
