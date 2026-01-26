import React, { useEffect, useState } from "react";
import { productApi } from "../api/product.api";
import { ProductList } from "../components/ProductList";
import { ProductFilter } from "../components/ProductFilter";

export const ShopPage = () => {
  const [page, setPage] = useState(1);
  const [bouquets, setBouquets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    status: 1,
    sort: "createdAt,asc",
    size: 10,
  });

  useEffect(() => {
    const fetchBouquets = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await productApi.getBouquets({
          page: page - 1, // backend is 0-based
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
  }, [page, filters]); // IMPORTANT

  return (
    <div>
      <h1>Bouquet Shop</h1>

      {/* FILTER UI */}
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

      <div style={{ marginTop: 20 }}>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} / {totalPages}
        </span>

        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};
