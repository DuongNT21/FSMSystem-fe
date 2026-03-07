import React, { useEffect, useMemo, useState } from "react";
import { getAllBatch, getBatchLogs } from "../../../services/inventoryService";
import { useNavigate } from "react-router-dom";
import CreateBatchPage from "./CreateBatchPage";
import UpdateBatchPage from "./UpdateBatchPage";

const InventoryPage = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("expireDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [openLogs, setOpenLogs] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logFilterType, setLogFilterType] = useState("ALL");
  const [logSortOrder, setLogSortOrder] = useState("desc");

  const handleViewLogs = async (batchId) => {
    try {
      const res = await getBatchLogs(batchId);
      setLogs(res?.data || []);
      setSelectedBatchId(batchId);
      setOpenLogs(true);
    } catch (error) {
      console.error("Load logs error:", error);
    }
  };

  const processedLogs = useMemo(() => {
    let data = [...logs];

    if (logFilterType !== "ALL") {
      data = data.filter((log) => log.actionType === logFilterType);
    }

    data.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return logSortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return data;
  }, [logs, logFilterType, logSortOrder]);

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

    if (filterStatus !== "ALL") {
      data = data.filter((item) => item.status === filterStatus);
    }

    if (minPrice !== "") {
      data = data.filter((item) => item.importPrice >= Number(minPrice));
    }

    if (maxPrice !== "") {
      data = data.filter((item) => item.importPrice <= Number(maxPrice));
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
  }, [
    batches,
    search,
    sortKey,
    sortOrder,
    filterLowStock,
    filterStatus,
    minPrice,
    maxPrice,
  ]);

  const totalBatch = batches.filter((item) => {
    const expireDate = new Date(item.expireDate);
    const today = new Date();
    return item.remainQuantity > 0 && expireDate >= today;
  }).length;
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
        <StatCard title="Available Batches" value={totalBatch} />
        <StatCard title="Total Remaining" value={totalRemain} />
        <StatCard title="Expiring Soon (7 days)" value={expiringSoon} />
      </div>

      {/* FILTER BAR */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 16,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: 12, fontWeight: 600 }}>Search</label>
          <input
            placeholder="Search raw material..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              width: 260,
              outline: "none",
              transition: "0.2s",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #1677ff")}
            onBlur={(e) => (e.target.style.border = "1px solid #ddd")}
          />
        </div>

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

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: 8, borderRadius: 6 }}
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="EXPIRED">EXPIRED</option>
          <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
        </select>

        <div
          style={{
            width: 320,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: 12, fontWeight: 600 }}>Min</label>
              <input
                type="range"
                min="0"
                max="1000000"
                step="1000"
                value={minPrice || 0}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="range-slider"
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: 12, fontWeight: 600 }}>Max</label>
              <input
                type="range"
                min="0"
                max="1000000"
                step="1000"
                value={maxPrice || 1000000}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="range-slider"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 500 }}>
            {Number(minPrice || 0).toLocaleString()} đ -{" "}
            {Number(maxPrice || 1000000).toLocaleString()} đ
          </div>
        </div>
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
                <th style={th}>Import Date</th>
                <th style={th}>Expire Date</th>
                <th style={th}>Original Quantity</th>
                <th style={th}>Remain Quantity</th>
                <th style={th}>Import Price</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {processedData.map((item) => {
                const expireDate = new Date(item.expireDate);
                const today = new Date();
                const isExpired = expireDate < today;

                return (
                  <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={td}>{item.id}</td>
                    <td style={td}>{item.rawMaterialName}</td>

                    <td style={td}>
                      {item.importDate
                        ? new Date(item.importDate).toLocaleDateString()
                        : ""}
                    </td>

                    <td
                      style={{
                        ...td,
                        color: isExpired ? "#cf1322" : "inherit",
                      }}
                    >
                      {item.expireDate
                        ? new Date(item.expireDate).toLocaleDateString()
                        : ""}
                    </td>

                    <td style={td}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: 6,
                          background: "#f0f5ff",
                          color: "#1d39c4",
                          fontWeight: 600,
                        }}
                      >
                        {item.originalQuantity}
                      </span>
                    </td>

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

                    <td style={td}>{item.importPrice?.toLocaleString()} đ</td>
                    <td style={td}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          background:
                            item.status === "ACTIVE"
                              ? "#e6f7ee"
                              : item.status === "EXPIRED"
                                ? "#fff1f0"
                                : "#f5f5f5",
                          color:
                            item.status === "ACTIVE"
                              ? "#1e7e34"
                              : item.status === "EXPIRED"
                                ? "#cf1322"
                                : "#595959",
                        }}
                      >
                        {item.status || "ACTIVE"}
                      </span>
                    </td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => handleViewLogs(item.id)}
                          style={btn}
                        >
                          Logs
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBatch(item);
                            setOpenUpdate(true);
                          }}
                          style={{
                            ...btn,
                            background: "#1677ff",
                          }}
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {openLogs && (
        <div style={modalOverlay}>
          <div
            style={{
              ...modalBox,
              width: 800,
              borderRadius: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  Inventory Logs
                </h3>
                <p style={{ margin: 0, color: "#888", fontSize: 13 }}>
                  Batch #{selectedBatchId}
                </p>
              </div>

              <button
                onClick={() => setOpenLogs(false)}
                style={{
                  border: "none",
                  background: "#f5f5f5",
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* FILTER BAR */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 16,
                justifyContent: "flex-end",
              }}
            >
              <select
                value={logFilterType}
                onChange={(e) => setLogFilterType(e.target.value)}
                style={{ padding: 8, borderRadius: 8 }}
              >
                <option value="ALL">All</option>
                <option value="IMPORT">IMPORT</option>
                <option value="EXPORT">EXPORT</option>
              </select>

              <button
                onClick={() =>
                  setLogSortOrder(logSortOrder === "asc" ? "desc" : "asc")
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "#1677ff",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {logSortOrder === "asc" ? "Oldest" : "Newest"}
              </button>
            </div>

            {processedLogs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 30,
                  color: "#999",
                }}
              >
                No logs found.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#fafafa" }}>
                    <th style={th}>ID</th>
                    <th style={th}>Action</th>
                    <th style={th}>Quantity</th>
                    <th style={th}>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {processedLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={td}>{log.id}</td>
                      <td style={td}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            background:
                              log.actionType === "IMPORT"
                                ? "#e6f7ee"
                                : "#fff1f0",
                            color:
                              log.actionType === "IMPORT"
                                ? "#1e7e34"
                                : "#cf1322",
                          }}
                        >
                          {log.actionType}
                        </span>
                      </td>
                      <td style={td}>{log.quantity}</td>
                      <td style={td}>
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString()
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
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
      <UpdateBatchPage
        open={openUpdate}
        batch={selectedBatch}
        onClose={() => setOpenUpdate(false)}
        onSuccess={loadData}
      />
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

const rangeStyle = document.createElement("style");
rangeStyle.innerHTML = `
.range-slider {
  width: 100%;
  height: 6px;
  border-radius: 6px;
  background: linear-gradient(90deg, #dbeafe 0%, #93c5fd 100%);
  outline: none;
  appearance: none;
  margin: 4px 0;
  box-sizing: border-box;
}

.range-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid #1677ff;
  cursor: pointer;
  transition: 0.2s ease;
}

.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 6px rgba(22,119,255,0.15);
}

.range-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid #1677ff;
  cursor: pointer;
}
`;
document.head.appendChild(rangeStyle);

export default InventoryPage;
