import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryService } from "../../../services/categoryService";
import { CheckCircle, XCircle, ArrowLeft, PlusCircle } from "lucide-react";

const CreateCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await categoryService.createCategory(name, description);

      navigate("/admin/categories");
    } catch (error) {
      setMessage("Không thể tạo danh mục. Vui lòng kiểm tra lại dữ liệu.");
      setIsSuccess(false);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-rose-500 mb-6 transition-colors font-medium group"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Quay lại danh sách
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-rose-500 p-6 flex items-center gap-3">
          <PlusCircle className="text-white" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-white">Thêm Danh Mục Mới</h1>
            <p className="text-rose-100 text-sm">
              Tạo nhóm sản phẩm mới cho hệ thống quản lý
            </p>
          </div>
        </div>

        <div className="p-8">
          {message && !isSuccess && (
            <div className="mb-6 p-4 rounded-xl text-white flex items-center gap-3 bg-red-500 animate-in fade-in slide-in-from-top-4 duration-300">
              <XCircle size={22} />
              <span className="font-medium">{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ví dụ: Sinh nhật, Khai trương, Chia buồn..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-50 focus:border-rose-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                placeholder="Mô tả ngắn gọn về mục đích hoặc đặc điểm của danh mục này..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-50 focus:border-rose-500 outline-none transition-all shadow-sm"
              ></textarea>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 md:flex-none bg-rose-500 hover:bg-rose-600 text-white px-10 py-3.5 rounded-xl transition-all font-bold shadow-lg shadow-rose-100 active:scale-95 flex items-center justify-center gap-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : (
                  "Tạo Danh Mục"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="hidden md:block px-10 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
