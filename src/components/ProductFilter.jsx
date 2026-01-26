import React from "react";
import "./ProductFilter.css";

export const ProductFilter = ({
  status,
  sort,
  pageSize,
  onChange,
}) => {
  return (
    <div className="filter-bar">
      <select
        value={status}
        onChange={(e) => onChange({ status: e.target.value })}
      >
        <option value={1}>On Sale</option>
        <option value={0}>Stopped</option>
      </select>

      <select
        value={sort}
        onChange={(e) => onChange({ sort: e.target.value })}
      >
        <option value="createdAt,asc">Oldest</option>
        <option value="createdAt,desc">Newest</option>
        <option value="price,asc">Price ↑</option>
        <option value="price,desc">Price ↓</option>
      </select>

      <select
        value={pageSize}
        onChange={(e) => onChange({ size: Number(e.target.value) })}
      >
        <option value={4}>4 / page</option>
        <option value={8}>8 / page</option>
        <option value={12}>12 / page</option>
      </select>
    </div>
  );
};
