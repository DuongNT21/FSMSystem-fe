import React, { useEffect, useMemo, useState } from "react";
import { getAllBatch } from "../../../services/inventoryService";
import { useNavigate } from "react-router-dom";
import CreateBatchPage from "./CreateBatchPage";

const InventoryPage = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("expireDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAllBatch();
      setBatches(res?.data || []);
    } catch (err) {
      console.error("Load batch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const processedData = useMemo(() => {
    let data = [...batches];

    if (search) {
      data = data.filter((item) =>
        item.rawMaterialName?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (filterLowStock) {
      data = data.filter((item) => item.remainQuantity < 60);
    }

    data.sort((a, b) => {
      let valueA = a[sortKey];
      let valueB = b[sortKey];

      if (sortKey === "expireDate") {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [batches, search, sortKey, sortOrder, filterLowStock]);

  const totalBatch = batches.length;
  const totalRemain = batches.reduce(
    (sum, item) => sum + (item.remainQuantity || 0),
    0,
  );

  const expiringSoon = batches.filter((item) => {
    const expireDate = new Date(item.expireDate);
    const today = new Date();
    const diff = (expireDate - today) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ fontWeight: 700 }}>Inventory Management</h2>
          <p style={{ color: "#888" }}>Full senior inventory dashboard</p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          style={{
            background: "#1677ff",
            border: "none",
            color: "white",
            padding: "10px 16px",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          + Create Batch
        </button>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <StatCard title="Total Batches" value={totalBatch} />
        <StatCard title="Total Remaining" value={totalRemain} />
        <StatCard title="Expiring Soon (7 days)" value={expiringSoon} />
      </div>

      {/* FILTER BAR */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <input
          placeholder="Search by raw material..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ddd",
            flex: 1,
          }}
        />

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          style={{ padding: 8, borderRadius: 6 }}
        >
          <option value="expireDate">Sort by Expire Date</option>
          <option value="remainQuantity">Sort by Quantity</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          style={{ padding: "8px 12px", borderRadius: 6 }}
        >
          {sortOrder === "asc" ? "Asc" : "Desc"}
        </button>

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={filterLowStock}
            onChange={() => setFilterLowStock(!filterLowStock)}
          />
          Low Stock
        </label>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f6f8" }}>
                <th style={th}>ID</th>
                <th style={th}>Raw Material</th>
                <th style={th}>Expire Date</th>
                <th style={th}>Import Price</th>
                <th style={th}>Remain</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {processedData.map((item) => {
                const expireDate = new Date(item.expireDate);
                const today = new Date();
                const diff = (expireDate - today) / (1000 * 60 * 60 * 24);

                return (
                  <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={td}>{item.id}</td>
                    <td style={td}>{item.rawMaterialName}</td>
                    <td
                      style={{
                        ...td,
                        color: diff <= 7 ? "#cf1322" : "inherit",
                      }}
                    >
                      {item.expireDate}
                    </td>
                    <td style={td}>{item.importPrice?.toLocaleString()} đ</td>
                    <td style={td}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: 6,
                          background:
                            item.remainQuantity < 60 ? "#fff1f0" : "#e6f7ee",
                          color:
                            item.remainQuantity < 60 ? "#cf1322" : "#1e7e34",
                          fontWeight: 600,
                        }}
                      >
                        {item.remainQuantity}
                      </span>
                    </td>
                    <td style={td}>
                      <button
                        onClick={() =>
                          navigate(`/admin/inventory/${item.id}/logs`)
                        }
                        style={btn}
                      >
                        View Logs
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {openCreate && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <h3 style={{ margin: 0 }}>Create Batch</h3>
              <button
                onClick={() => setOpenCreate(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>
            <CreateBatchPage />
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 12,
      padding: 20,
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    }}
  >
    <p style={{ color: "#888", marginBottom: 6 }}>{title}</p>
    <h3 style={{ fontSize: 22, fontWeight: 700 }}>{value}</h3>
  </div>
);

const th = { padding: 12, textAlign: "left" };
const td = { padding: 12 };
const btn = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  background: "#ff4d6d",
  color: "#fff",
  cursor: "pointer",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalBox = {
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  width: 500,
  maxHeight: "80vh",
  overflowY: "auto",
};

export default InventoryPage;
