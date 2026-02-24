import React, { useEffect, useState } from "react";
import { productApi } from "../../../shared/api/product.api";
import { ProductList } from "../components/ProductList";
import { ProductFilter } from "../components/ProductFilter";
import { BouquetModal } from "../components/BouquetModal";

import "./BouquetCreatePage.css";
import { getPaginationPages } from "../../../shared/utils/pagination";
import { handleError } from "../../../shared/utils/errorHandler";

export const BouquetCreatePage = () => {
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

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedBouquet, setSelectedBouquet] = useState(null);

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

  const handleCreate = () => {
    setModalMode("create");
    setSelectedBouquet(null);
    setIsModalOpen(true);
  };

  const handleEdit = (bouquet) => {
    setModalMode("update");
    setSelectedBouquet(bouquet);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (modalMode === "create") {
        await productApi.create(data);
      } else {
        await productApi.update({ ...data, id: selectedBouquet.id });
      }
      setIsModalOpen(false);
      setFilters((prev) => ({ ...prev }));
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await productApi.delete(id);
        setFilters((prev) => ({ ...prev }));
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <div>
      <h1>Manage Bouquets</h1>

      <ProductFilter
        status={filters.status}
        sort={filters.sort}
        pageSize={filters.size}
        onChange={(changed) => {
          setPage(1); // reset page when filter changes
          setFilters((prev) => ({ ...prev, ...changed }));
        }}
        onCreate={handleCreate}
      />

      {loading && <p>Loading...</p>}
      {!loading && error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && <ProductList bouquets={bouquets} onEdit={handleEdit} onDelete={handleDelete} />}

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

      {isModalOpen && (
        <BouquetModal
          mode={modalMode}
          bouquet={selectedBouquet}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
