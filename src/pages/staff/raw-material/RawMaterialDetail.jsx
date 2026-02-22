import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Save,
  Trash2,
  Package,
  DollarSign,
  Tag,
} from "lucide-react";
import { rawMaterialService } from "../../../services/rawMaterialService";

const RawMaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", quantity: "", importPrice: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await rawMaterialService.getRawMaterialById(id);
        const data = res?.data?.data ?? res?.data ?? res;
        setItem(data);
        setForm({
          name: data.name,
          quantity: data.quantity,
          importPrice: data.importPrice,
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleUpdate = async () => {
    setErrors({});
    const errs = {};
    if (!form.name.trim()) errs.name = "Tên là bắt buộc";
    if (!form.quantity || Number(form.quantity) <= 0)
      errs.quantity = "Số lượng > 0";
    if (!form.importPrice || Number(form.importPrice) <= 0)
      errs.importPrice = "Giá nhập > 0";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      const res = await rawMaterialService.updateRawMaterial(id, {
        name: form.name.trim(),
        quantity: Number(form.quantity),
        importPrice: Number(form.importPrice),
      });
      const updatedData = res?.data?.data ?? res?.data ?? res;
      setItem(updatedData);
      setEditing(false);
    } catch (err) {
      alert(err?.response?.data?.message ?? "Lỗi khi cập nhật");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nguyên liệu này?")) {
      try {
        await rawMaterialService.deleteRawMaterial(id);
        navigate("/staff/raw-material");
      } catch (err) {
        alert("Lỗi khi xóa nguyên liệu");
      }
    }
  };

  if (loading)
    return <div className="p-10 text-center text-gray-400">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {editing ? "Chỉnh sửa nguyên liệu" : "Chi tiết nguyên liệu"}
            </h2>
            <p className="text-xs text-gray-500 font-medium tracking-tight">
              Mã định danh: #{id}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-rose-500" /> Tên nguyên liệu
              </label>
              {editing ? (
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-rose-50 focus:border-rose-400 transition-all outline-none font-medium"
                />
              ) : (
                <div className="px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl font-semibold text-gray-700">
                  {item.name}
                </div>
              )}
              {errors.name && (
                <p className="text-red-500 text-[11px] italic font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-rose-500" /> Số lượng
                </label>
                {editing ? (
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-rose-50 focus:border-rose-400 transition-all outline-none font-medium"
                  />
                ) : (
                  <div className="px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl font-semibold text-gray-700">
                    {item.quantity}
                  </div>
                )}
                {errors.quantity && (
                  <p className="text-red-500 text-[11px] italic font-medium">
                    {errors.quantity}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-rose-500" /> Giá nhập
                  (đ)
                </label>
                {editing ? (
                  <input
                    type="number"
                    value={form.importPrice}
                    onChange={(e) =>
                      setForm({ ...form, importPrice: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-rose-50 focus:border-rose-400 transition-all outline-none font-medium"
                  />
                ) : (
                  <div className="px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl font-semibold text-gray-700">
                    {new Intl.NumberFormat("vi-VN").format(item.importPrice)} đ
                  </div>
                )}
                {errors.importPrice && (
                  <p className="text-red-500 text-[11px] italic font-medium">
                    {errors.importPrice}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center font-medium">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                Thành tiền tồn kho:
              </span>
              <span className="text-xl font-bold text-rose-600 tracking-tight transition-all">
                {new Intl.NumberFormat("vi-VN").format(
                  (editing ? form.quantity : item.quantity) *
                    (editing ? form.importPrice : item.importPrice),
                )}{" "}
                đ
              </span>
            </div>
          </div>

          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center gap-3">
            {!editing ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-md shadow-rose-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Edit3 className="w-4 h-4" /> Chỉnh sửa
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-3 border border-gray-200 bg-white text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Xóa
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={submitting}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-md shadow-rose-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />{" "}
                  {submitting ? "Đang lưu..." : "Lưu cập nhật"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setErrors({});
                  }}
                  className="px-8 py-3 bg-white border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Hủy
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RawMaterialDetail;
