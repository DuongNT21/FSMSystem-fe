import React, { useEffect, useState } from "react";
import { updateBatch } from "../../../services/inventoryService";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  width: 420,
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontWeight: 600,
  fontSize: 14,
};

const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
  marginBottom: 16,
};

const buttonRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 12,
};

const btn = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const UpdateBatchPage = ({ open, onClose, batch, onSuccess }) => {
  const [form, setForm] = useState({
    expireDate: "",
    importPrice: "",
  });

  useEffect(() => {
    if (batch) {
      setForm({
        expireDate: batch.expireDate ? batch.expireDate.substring(0, 10) : "",
        importPrice: batch.importPrice ?? "",
      });
    }
  }, [batch]);

  if (!open || !batch) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { expireDate, importPrice } = form;

    // Must change at least one field
    if (!expireDate && importPrice === "") {
      alert("Please change at least one field.");
      return;
    }

    // Validate expire date
    if (expireDate) {
      const newExpire = new Date(expireDate);
      const importDate = new Date(batch.importDate);

      if (isNaN(newExpire.getTime())) {
        alert("Invalid expire date.");
        return;
      }

      if (newExpire < importDate) {
        alert("Expire date cannot be before import date.");
        return;
      }
    }

    // Validate import price
    if (importPrice !== "") {
      const price = Number(importPrice);

      if (isNaN(price)) {
        alert("Import price must be a number.");
        return;
      }

      if (price < 0) {
        alert("Import price cannot be negative.");
        return;
      }
    }

    try {
      await updateBatch(batch.id, {
        expireDate: expireDate || null,
        importPrice: importPrice !== "" ? Number(importPrice) : null,
      });

      alert("Update successful 🚀");

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginBottom: 20 }}>Update Batch #{batch.id}</h3>

        <div>
          <label style={labelStyle}>Expire Date</label>
          <input
            type="date"
            name="expireDate"
            value={form.expireDate}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Import Price</label>
          <input
            type="number"
            name="importPrice"
            value={form.importPrice}
            onChange={handleChange}
            min="0"
            style={inputStyle}
          />
        </div>

        <div style={buttonRow}>
          <button onClick={onClose} style={{ ...btn, background: "#f5f5f5" }}>
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            style={{ ...btn, background: "#1677ff", color: "#fff" }}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateBatchPage;
