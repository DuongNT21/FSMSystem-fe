import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Save, Trash2 } from "lucide-react";
import { rawMaterialService } from "../../../services/rawMaterialService";

const RawMaterialDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", quantity: "", importPrice: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await rawMaterialService.getRawMaterialById(id);
        const data = res?.data ?? res;
        const result = data?.data ?? data;
        setItem(result);
        setForm({
          name: result?.name ?? "",
          quantity: result?.quantity ?? "",
          importPrice: result?.importPrice ?? "",
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <h2 className="text-2xl font-semibold">Chi tiết nguyên liệu</h2>
      </div>

      <div className="bg-white border rounded-lg shadow-sm p-6 max-w-xl">
        {loading ? (
          <div className="text-gray-500">Đang tải...</div>
        ) : !item ? (
          <div className="text-gray-500">Không tìm thấy nguyên liệu</div>
        ) : (
          <div>
            {!editing ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Tên</div>
                  <div className="text-lg font-medium">{item.name}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Số lượng</div>
                  <div className="text-lg">{item.quantity}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Giá nhập</div>
                  <div className="text-lg">{item.importPrice}</div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600"
                  >
                    <Edit className="w-4 h-4" /> Chỉnh sửa
                  </button>

                  <button
                    onClick={async () => {
                      if (!confirm("Bạn có chắc muốn xóa nguyên liệu này?"))
                        return;
                      try {
                        setDeleting(true);
                        await rawMaterialService.deleteRawMaterial(id);
                        navigate("/staff/raw-material");
                      } catch (err) {
                        console.error(err);
                        alert(
                          err?.response?.data?.message ??
                            err.message ??
                            "Lỗi khi xóa",
                        );
                      } finally {
                        setDeleting(false);
                      }
                    }}
                    disabled={deleting}
                    className="px-4 py-2 rounded-lg border text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />{" "}
                    {deleting ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setErrors({});
                  const errs = {};
                  if (!form.name.trim()) errs.name = "Tên là bắt buộc";
                  if (!form.quantity || Number(form.quantity) <= 0)
                    errs.quantity = "Số lượng phải lớn hơn 0";
                  if (!form.importPrice || Number(form.importPrice) <= 0)
                    errs.importPrice = "Giá nhập phải lớn hơn 0";
                  if (Object.keys(errs).length) return setErrors(errs);
                  try {
                    setSaving(true);
                    const res = await rawMaterialService.updateRawMaterial(id, {
                      name: form.name.trim(),
                      quantity: Number(form.quantity),
                      importPrice: Number(form.importPrice),
                    });
                    const data = res?.data ?? res;
                    const result = data?.data ?? data;
                    setItem(result);
                    setEditing(false);
                  } catch (err) {
                    console.error(err);
                    alert(
                      err?.response?.data?.message ??
                        err.message ??
                        "Lỗi khi lưu",
                    );
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Tên
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, name: e.target.value }))
                      }
                      className="w-full border px-3 py-2 rounded-lg"
                    />
                    {errors.name && (
                      <div className="text-red-600 text-sm mt-1">
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Số lượng
                    </label>
                    <input
                      type="number"
                      value={form.quantity}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, quantity: e.target.value }))
                      }
                      className="w-full border px-3 py-2 rounded-lg"
                    />
                    {errors.quantity && (
                      <div className="text-red-600 text-sm mt-1">
                        {errors.quantity}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Giá nhập
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.importPrice}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, importPrice: e.target.value }))
                      }
                      className="w-full border px-3 py-2 rounded-lg"
                    />
                    {errors.importPrice && (
                      <div className="text-red-600 text-sm mt-1">
                        {errors.importPrice}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg"
                    >
                      <Save className="w-4 h-4" />{" "}
                      {saving ? "Đang lưu..." : "Lưu"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 rounded-lg border"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RawMaterialDetail;
