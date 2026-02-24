import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categoryService } from "../../../services/categoryService";
import { CheckCircle, XCircle, ArrowLeft, Save, Edit3, X } from "lucide-react";

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getCategoryById(id);
        setCategory(data);
        setEditData({ name: data.name, description: data.description });
      } catch (error) {
        setMessage("Không thể tải thông tin danh mục.");
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCategory();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await categoryService.updateCategory(id, editData);
      setMessage("Cập nhật danh mục thành công!");
      setIsSuccess(true);
      setCategory({ ...category, ...editData });
      setIsEditing(false);

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Cập nhật thất bại. Vui lòng thử lại.");
      setIsSuccess(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-rose-500 mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Quay lại danh sách
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-rose-500 p-6">
          <h1 className="text-2xl font-bold text-white">Chi tiết danh mục</h1>
          <p className="text-rose-100 text-sm font-mono">ID: {id}</p>
        </div>

        <div className="p-8">
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-white flex items-center gap-3 animate-in fade-in duration-300 ${
                isSuccess ? "bg-emerald-500" : "bg-red-500"
              }`}
            >
              {isSuccess ? <CheckCircle size={22} /> : <XCircle size={22} />}
              <span className="font-medium">{message}</span>
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Tên danh mục
                </label>
                <p className="text-xl font-semibold text-gray-800 mt-1">
                  {category?.name}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Mô tả
                </label>
                <p className="text-gray-600 mt-1 leading-relaxed">
                  {category?.description || "Không có mô tả"}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-8 py-2.5 rounded-xl transition-all font-semibold shadow-lg shadow-rose-100 active:scale-95"
              >
                <Edit3 size={18} /> Chỉnh sửa
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Tên danh mục:
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-50 focus:border-rose-500 outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Mô tả:
                </label>
                <textarea
                  rows="4"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-50 focus:border-rose-500 outline-none transition-all shadow-sm"
                ></textarea>
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl transition-all font-semibold shadow-lg shadow-emerald-100 active:scale-95"
                >
                  <Save size={18} /> Lưu thay đổi
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2.5 rounded-xl transition-all font-semibold"
                >
                  <X size={18} /> Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
