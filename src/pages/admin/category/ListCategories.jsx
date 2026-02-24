import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  Trash2,
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";
import { categoryService } from "../../../services/categoryService";

const ListCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState({ text: "", type: "" });
  const perPage = 8;

  const fetchList = async () => {
    try {
      setLoading(true);
      const list = await categoryService.getListCategories();
      setCategories(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showNotify("Không thể tải danh sách danh mục", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const showNotify = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let data = [...categories];
    const q = query.trim().toLowerCase();

    if (q) {
      data = data.filter((i) => (i.name || "").toLowerCase().includes(q));
    }

    if (sortField) {
      data.sort((a, b) => {
        const x = a[sortField] || "";
        const y = b[sortField] || "";
        if (typeof x === "string") {
          return sortDir === "asc" ? x.localeCompare(y) : y.localeCompare(x);
        }
        return sortDir === "asc" ? x - y : y - x;
      });
    }
    return data;
  }, [categories, query, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return <ArrowUpDown size={14} className="ml-1 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp size={14} className="ml-1 text-rose-600" />
    ) : (
      <ChevronDown size={14} className="ml-1 text-rose-600" />
    );
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Bạn có chắc muốn xóa danh mục "${category.name}"?`))
      return;

    try {
      await categoryService.deleteCategory(category.id);
      showNotify("Xóa danh mục thành công", "success");
      await fetchList();
    } catch (error) {
      showNotify("Xóa thất bại. Danh mục có thể đang chứa sản phẩm.", "error");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutGrid className="text-rose-500" size={24} /> Quản lý danh mục
          </h2>
          <p className="text-sm text-gray-500">
            Xem và quản lý tất cả các nhóm sản phẩm trong hệ thống
          </p>
        </div>

        <Link
          to="/admin/categories/create"
          className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-xl transition-all font-semibold shadow-lg shadow-rose-100 active:scale-95 w-full md:w-auto text-sm"
        >
          <Plus size={18} /> Thêm mới danh mục
        </Link>
      </div>

      {message.text && (
        <div
          className={`mb-4 p-4 rounded-lg text-white text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
            message.type === "success" ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-6">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm kiếm danh mục theo tên..."
            className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-50 focus:border-rose-500 outline-none transition-all shadow-sm bg-white"
          />
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th
                  onClick={() => handleSort("name")}
                  className="p-4 text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    Tên danh mục <SortIcon field="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("description")}
                  className="p-4 text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    Mô tả <SortIcon field="description" />
                  </div>
                </th>
                <th className="p-4 text-center text-sm font-bold text-gray-700 w-32">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium">
                        Đang tải dữ liệu...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="p-12 text-center text-gray-400 italic"
                  >
                    Không tìm thấy danh mục nào phù hợp
                  </td>
                </tr>
              ) : (
                paged.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-rose-50/30 transition-colors group"
                  >
                    <td className="p-4 text-sm text-gray-800">
                      <Link
                        to={`/admin/categories/${category.id}`}
                        className="font-bold hover:text-rose-600 transition-colors"
                      >
                        {category.name}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-gray-600 max-w-md truncate">
                      {category.description || (
                        <span className="text-gray-300 italic">
                          Chưa có mô tả
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-1">
                        <Link
                          to={`/admin/categories/${category.id}`}
                          className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(category)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa danh mục"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 font-medium">
            Trang <span className="text-rose-600">{page}</span> trên{" "}
            {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm text-gray-600"
            >
              Trước
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm text-gray-600"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCategories;
