import React, { useEffect, useState } from "react";
import { productApi } from "../../../shared/api/product.api";
import { ProductList } from "../components/ProductList";
import { ProductFilter } from "../components/ProductFilter";

import "./ShopPage.css";
import { getPaginationPages } from "../../../shared/utils/pagination";

export const ShopPage = () => {
  const [page, setPage] = useState(1);
  const [bouquets, setBouquets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pages = getPaginationPages(page, totalPages);

  const [filters, setFilters] = useState({
    status: 1,
    sort: "createdAt,asc",
    size: 20,
  });

  useEffect(() => {
    const fetchBouquets = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await productApi.getBouquets({
          page: page - 1,
          ...filters,
        });

        setBouquets(res.bouquets ?? []);
        setTotalPages(res.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch bouquets", err);
        setError("Unable to load bouquets");
      } finally {
        setLoading(false);
      }
    };

    fetchBouquets();
  }, [page, filters]);

  return (
    <div>
      <h1>Bouquet Shop</h1>

      <ProductFilter
        status={filters.status}
        sort={filters.sort}
        pageSize={filters.size}
        onChange={(changed) => {
          setPage(1); // reset page when filter changes
          setFilters((prev) => ({ ...prev, ...changed }));
        }}
      />

      {loading && <p>Loading...</p>}
      {!loading && error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && <ProductList bouquets={bouquets} />}

      <div className="pagination">
        <button
          className="nav-btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ‹
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={i} className="dots">
              …
            </span>
          ) : (
            <button
              key={p}
              className={`page-btn ${p === page ? "active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ),
        )}

        <button
          className="nav-btn"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
};
