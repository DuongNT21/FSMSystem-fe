import React, { useEffect, useState } from "react";
import { createBatch } from "../../../services/inventoryService";
import { useNavigate } from "react-router-dom";
import { getAllRawMaterial } from "../../../services/rawMaterialService";

const CreateBatchPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    rawMaterialId: "",
    importDate: "",
    expireDate: "",
    importPrice: "",
    originalQuantity: "",
  });

  const [rawMaterials, setRawMaterials] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const loadRawMaterials = async () => {
      try {
        const res = await getAllRawMaterial();

        // Debug full response to ensure structure is correct
        console.log("RAW MATERIAL FULL RESPONSE => ", res);

        // Handle multiple possible response structures safely
        const data =
          res?.data?.data?.data || res?.data?.data || res?.data || [];

        console.log("RAW MATERIAL LIST => ", data);

        setRawMaterials(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Load raw material error", err);
      }
    };

    loadRawMaterials();
  }, []);

  const handleSubmit = async () => {
    try {
      await createBatch(form);

      alert("Create batch success 🚀");

      navigate("/admin/inventory");
    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  };

  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 420,
          background: "#ffffff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700, marginBottom: 4 }}>
            Create Inventory Batch
          </h2>
          <p style={{ color: "#888", fontSize: 13 }}>
            Add new raw material batch
          </p>
        </div>

        {/* FORM */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600 }}>
              Raw Material
            </label>
            <select
              name="rawMaterialId"
              value={form.rawMaterialId}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select raw material</option>
              {rawMaterials.map((rm) => (
                <option key={rm.id} value={rm.id}>
                  {rm.name}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Import Date</label>
              <input
                type="date"
                name="importDate"
                value={form.importDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

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
          </div>

          <div>
            <label style={labelStyle}>Import Price</label>
            <input
              name="importPrice"
              placeholder="Enter import price"
              value={form.importPrice}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Quantity</label>
            <input
              name="originalQuantity"
              placeholder="Enter quantity"
              value={form.originalQuantity}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              marginTop: 8,
              background: "#1677ff",
              color: "#fff",
              border: "none",
              padding: "10px",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Create Batch
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  marginTop: 6,
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #ddd",
  outline: "none",
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
};

export default CreateBatchPage;
