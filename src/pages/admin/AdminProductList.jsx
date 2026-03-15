import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { bouquetApi, materialApi, categoryApi } from "../../apis/flowerApi";
import { BouquetModal } from "./BouquetModal";

export const AdminProductList = () => {
  const [bouquets, setBouquets] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBouquet, setSelectedBouquet] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    materialId: "",
    categoryId: "",
  });

  const fetchBouquets = async () => {
    setLoading(true);
    try {
      const response = await bouquetApi.get({
        page,
        size: 10,
        ...filters,
      });

      setBouquets(response?.data?.map((item) => item.bouquet) ?? []);

      setTotalPages(response?.totalPages ?? 0);
      setTotal(response?.total ?? 0);
    } catch (error) {
      console.error("Error fetching bouquets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await materialApi.getAll({ size: 100 });
      const d = response?.data;
       const payload = response?.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data?.items)
          ? payload.data.items
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
      setMaterials(list);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll({ size: 100 });
      const payload = response?.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data?.items)
          ? payload.data.items
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
      setCategories(list);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBouquets();
  }, [page]);

  useEffect(() => {
    fetchMaterials();
    fetchCategories();
  }, []);

  const handleApplyFilters = () => {
    setPage(0);
    fetchBouquets();
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      minPrice: "",
      maxPrice: "",
      materialId: "",
      categoryId: "",
    });
    setPage(0);
    // We need to wait for state update or pass it directly
    setTimeout(fetchBouquets, 0);
  };

  const handleEdit = (bouquet) => {
    setSelectedBouquet(bouquet);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bó hoa này?")) {
      try {
        await bouquetApi.delete(id);
        fetchBouquets();
      } catch (error) {
        alert("Lỗi khi xóa sản phẩm");
      }
    }
  };

  const handleCreate = () => {
    setSelectedBouquet(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Danh sách bó hoa</h2>
        <button
          onClick={handleCreate}
          className="bg-rose-500 hover:opacity-90 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all transform active:scale-95"
        >
          <Plus size={18} />
          <span>Tạo Sản Phẩm</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tìm kiếm tên bó hoa
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500 transition-colors"
                placeholder="VD: Hoa hồng đỏ..."
                type="text"
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Khoảng giá (VND)
            </label>
            <div className="flex items-center gap-2">
              <input
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500 transition-colors"
                placeholder="Min"
                type="number"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
              />
              <span className="text-slate-400">-</span>
              <input
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500 transition-colors"
                placeholder="Max"
                type="number"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Vật tư (Materials)
            </label>
            <select
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500 transition-colors"
              value={filters.materialId}
              onChange={(e) =>
                setFilters({ ...filters, materialId: e.target.value })
              }
            >
              <option value="">Tất cả vật tư</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Danh mục
            </label>
            <select
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500 transition-colors"
              value={filters.categoryId}
              onChange={(e) =>
                setFilters({ ...filters, categoryId: e.target.value })
              }
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClearFilters}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              Xóa lọc
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-rose-500 text-white py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tên sản phẩm
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Giá niêm yết
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Vật tư dùng
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-10 text-center text-slate-400"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : bouquets.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-10 text-center text-slate-400"
                >
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            ) : (
              bouquets.map((b) => {
                return (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                        <img
                          alt={b.name}
                          className="w-full h-full object-cover"
                          src={
                            b.images?.[0]?.image ||
                            "https://picsum.photos/200/200?flower"
                          }
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">
                        {b.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        ID: {b.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {b.category ? (
                        <span className="bg-rose-50 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {b.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {b.price.toLocaleString()} VND
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {b.bouquetsMaterials?.slice(0, 2).map((m, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded"
                          >
                            {m.rawMaterialName} (x{m.quantity})
                          </span>
                        ))}
                        {b.bouquetsMaterials?.length > 2 && (
                          <span className="text-[10px] text-slate-400">
                            +{b.bouquetsMaterials.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${b.status === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {b.status === 1 ? "Đang bán" : "Tạm ngưng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(b)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {bouquets.length} của {total} sản phẩm
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-white transition-colors disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 flex items-center justify-center rounded font-bold text-sm transition-all ${page === i ? "bg-rose-500 text-white shadow-md" : "border border-slate-200 hover:bg-white"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-white transition-colors disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <BouquetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bouquet={selectedBouquet}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchBouquets();
          }}
        />
      )}
    </div>
  );
};
