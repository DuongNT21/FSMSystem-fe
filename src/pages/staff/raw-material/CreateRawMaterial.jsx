import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Package, DollarSign, Tag } from "lucide-react";
import { rawMaterialService } from "../../../services/rawMaterialService";

const CreateRawMaterial = () => {
  const [form, setForm] = useState({ name: "", quantity: "", importPrice: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Tên nguyên liệu là bắt buộc";
    if (!form.quantity || Number(form.quantity) <= 0)
      e.quantity = "Số lượng phải lớn hơn 0";
    if (!form.importPrice || Number(form.importPrice) <= 0)
      e.importPrice = "Giá nhập phải lớn hơn 0";
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
      setErrors({
        _form: err?.response?.data?.message || "Lỗi khi kết nối hệ thống",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all border border-transparent hover:border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              Thêm nguyên liệu mới
            </h2>
            <p className="text-sm text-gray-500">
              Điền thông tin để cập nhật vào kho hàng
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
        >
          <div className="p-8 space-y-8">
            {errors._form && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded">
                {errors._form}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Tag className="w-4 h-4" /> Tên sản phẩm
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập tên nguyên liệu..."
                className={`w-full px-4 py-3 bg-gray-50 border ${errors.name ? "border-red-400" : "border-gray-200"} rounded-xl focus:bg-white focus:ring-4 focus:ring-rose-50 focus:border-rose-500 transition-all outline-none font-medium text-gray-700`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs font-medium italic">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Package className="w-4 h-4" /> Số lượng
                </label>
                <input
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-4 py-3 bg-gray-50 border ${errors.quantity ? "border-red-400" : "border-gray-200"} rounded-xl focus:bg-white focus:ring-4 focus:ring-rose-50 focus:border-rose-500 transition-all outline-none font-medium text-gray-700`}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-xs font-medium italic">
                    {errors.quantity}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Giá nhập (đ)
                </label>
                <input
                  name="importPrice"
                  type="number"
                  value={form.importPrice}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-4 py-3 bg-gray-50 border ${errors.importPrice ? "border-red-400" : "border-gray-200"} rounded-xl focus:bg-white focus:ring-4 focus:ring-rose-50 focus:border-rose-500 transition-all outline-none font-medium text-gray-700`}
                />
                {errors.importPrice && (
                  <p className="text-red-500 text-xs font-medium italic">
                    {errors.importPrice}
                  </p>
                )}
              </div>
            </div>

            {form.importPrice && (
              <div className="bg-rose-50 p-5 rounded-2xl flex justify-between items-center border border-rose-100 animate-in fade-in slide-in-from-top-2">
                <span className="text-sm font-bold text-rose-700 uppercase tracking-tighter">
                  Ước tính giá trị hiển thị:
                </span>
                <span className="text-2xl font-black text-rose-600 italic">
                  {new Intl.NumberFormat("vi-VN").format(
                    Number(form.importPrice) || 0,
                  )}{" "}
                  <span className="text-sm">VND</span>
                </span>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-6 border-t border-gray-100 flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-[0.98] disabled:bg-gray-300 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              <Save className="w-5 h-5" />{" "}
              {submitting ? "Đang lưu..." : "Lưu nguyên liệu"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all text-sm uppercase tracking-widest"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRawMaterial;
