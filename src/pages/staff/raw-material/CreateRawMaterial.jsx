import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { rawMaterialService } from "../../../services/rawMaterialService";

const CreateRawMaterial = () => {
  const [form, setForm] = useState({ name: "", quantity: "", importPrice: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Tên là bắt buộc";
    if (!form.quantity || Number(form.quantity) <= 0) e.quantity = "Số lượng phải lớn hơn 0";
    if (!form.importPrice || Number(form.importPrice) <= 0) e.importPrice = "Giá nhập phải lớn hơn 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      await rawMaterialService.createRawMaterial({
        name: form.name.trim(),
        quantity: Number(form.quantity),
        importPrice: Number(form.importPrice),
      });
      navigate("/staff/raw-material");
    } catch (err) {
      const msg = err?.response?.data?.message ?? err.message ?? "Lỗi";
      setErrors({ _form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <h2 className="text-2xl font-semibold">Thêm nguyên liệu</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm max-w-xl">
        {errors._form && (
          <div className="mb-4 text-red-600">{errors._form}</div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tên</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
          {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Số lượng</label>
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
          {errors.quantity && <div className="text-red-600 text-sm mt-1">{errors.quantity}</div>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Giá nhập</label>
          <input
            name="importPrice"
            type="number"
            value={form.importPrice}
            onChange={handleChange}
            step="0.01"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
          {errors.importPrice && (
            <div className="text-red-600 text-sm mt-1">{errors.importPrice}</div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> Lưu
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRawMaterial;
