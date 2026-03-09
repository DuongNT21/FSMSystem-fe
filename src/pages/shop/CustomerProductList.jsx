import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { bouquetApi, materialApi } from "../../apis/flowerApi";
import { Link } from "react-router-dom";
import { categoryService } from "../../services/categoryService";
import { addToCart } from "../../utils/cartUtils";
import { toast } from "react-toastify";

export const CustomerProductList = () => {
  const [bouquets, setBouquets] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    name: "",
    minPrice: 0,
    maxPrice: 5000000,
    materialId: "",
    categoryId: "",
  });

  const fetchBouquets = async () => {
    setLoading(true);
    try {
      console.log("Fetching bouquets with request", {
        page,
        size: 9,
        status: 1,
        categoryId: filters.categoryId,
        ...filters,
      });
      const response = await bouquetApi.get({
        page,
        size: 9,
        status: 1, // Only show active ones
        categoryId: filters.categoryId,
        ...filters,
      });
      setBouquets(response?.data?.map((item) => item.bouquet) ?? []);
      setTotalPages(response?.totalPages ?? 0);
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
      setMaterials(
        Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [],
      );
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchCategories = async () => {
    console.log("Fetching categories...");
    try {
      const response = await categoryService.getListCategories({
        page: 0,
        size: 1000,
      });
      setCategories(response);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchBouquets();
  }, [page]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleApplyFilters = () => {
    setPage(0);
    fetchBouquets();
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} đã được thêm vào giỏ hàng!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <nav className="flex text-sm font-medium text-slate-500 mb-4">
          <ol className="flex items-center space-x-2">
            <li>
              <Link className="hover:text-rose-500 transition-colors" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <ChevronRight size={14} />
              <span className="text-rose-500">Danh mục Sản phẩm</span>
            </li>
          </ol>
        </nav>
        <h2 className="text-4xl font-extrabold text-slate-900">
          Sản Phẩm Bó Hoa
        </h2>
        <p className="text-slate-500 mt-2 max-w-2xl">
          Khám phá thế giới hoa tươi nghệ thuật với những thiết kế độc bản từ
          FlowerShop.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-72 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4">
              Tìm kiếm sản phẩm
            </h3>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-rose-500 transition-colors">
                <Search size={18} />
              </div>
              <input
                className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl text-sm transition-all"
                placeholder="Tên sản phẩm..."
                type="text"
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
              <Filter size={18} className="text-rose-500" />
              Bộ lọc sản phẩm
            </h3>
            <div className="space-y-8">
              <div>
                <p className="text-[13px] font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Vật tư (Hoa & Phụ kiện)
                </p>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {materials.map((m) => (
                    <label
                      key={m.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        className="rounded text-rose-500 focus:ring-rose-500 size-4 border-slate-300"
                        type="radio"
                        name="material"
                        checked={filters.materialId === m.id.toString()}
                        onChange={() =>
                          setFilters({
                            ...filters,
                            materialId: m.id.toString(),
                          })
                        }
                      />
                      <span
                        className={`text-sm transition-colors ${filters.materialId === m.id.toString() ? "text-rose-500 font-bold" : "text-slate-600 group-hover:text-rose-500"}`}
                      >
                        {m.name}
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      className="rounded text-rose-500 focus:ring-rose-500 size-4 border-slate-300"
                      type="radio"
                      name="material"
                      checked={filters.materialId === ""}
                      onChange={() =>
                        setFilters({ ...filters, materialId: "" })
                      }
                    />
                    <span
                      className={`text-sm transition-colors ${filters.materialId === "" ? "text-rose-500 font-bold" : "text-slate-600 group-hover:text-rose-500"}`}
                    >
                      Tất cả
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-[13px] font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Danh mục
                </p>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      className="rounded text-rose-500 focus:ring-rose-500 size-4 border-slate-300"
                      type="radio"
                      name="category"
                      checked={filters.categoryId === ""}
                      onChange={() =>
                        setFilters({ ...filters, categoryId: "" })
                      }
                    />
                    <span
                      className={`text-sm transition-colors ${
                        filters.categoryId === ""
                          ? "text-rose-500 font-bold"
                          : "text-slate-600 group-hover:text-rose-500"
                      }`}
                    >
                      Tất cả
                    </span>
                  </label>
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        className="rounded text-rose-500 focus:ring-rose-500 size-4 border-slate-300"
                        type="radio"
                        name="category"
                        checked={filters.categoryId === category.id.toString()}
                        onChange={() =>
                          setFilters({
                            ...filters,
                            categoryId: category.id.toString(),
                          })
                        }
                      />
                      <span
                        className={`text-sm transition-colors ${
                          filters.categoryId === category.id.toString()
                            ? "text-rose-500 font-bold"
                            : "text-slate-600 group-hover:text-rose-500"
                        }`}
                      >
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[13px] font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Khoảng giá (VNĐ)
                </p>
                <div className="px-1">
                  <input
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    max="5000000"
                    min="0"
                    step="100000"
                    type="range"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxPrice: parseInt(e.target.value),
                      })
                    }
                  />
                  <div className="flex justify-between items-center mt-4 text-[11px] font-extrabold text-slate-500 uppercase">
                    <span className="bg-slate-50 px-2 py-1 rounded">0đ</span>
                    <span className="bg-slate-50 px-2 py-1 rounded">
                      {filters.maxPrice.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleApplyFilters}
                className="w-full py-3 bg-slate-900 text-white hover:bg-rose-500 font-bold rounded-xl transition-all text-xs uppercase tracking-widest"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
            <p className="text-sm text-slate-500 font-medium">
              Hiển thị{" "}
              <span className="text-slate-900 font-bold">
                {bouquets.length}
              </span>{" "}
              sản phẩm
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider shrink-0">
                Sắp xếp:
              </span>
              <select className="bg-white border-slate-200 rounded-xl text-sm font-semibold focus:ring-rose-500 focus:border-rose-500 py-2 px-4 pr-10">
                <option>Mới nhất</option>
                <option>Giá: Thấp đến Cao</option>
                <option>Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-slate-100 rounded-3xl aspect-4/5"
                ></div>
              ))}
            </div>
          ) : bouquets.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400">
                Không tìm thấy sản phẩm nào phù hợp.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {bouquets.map((b) => {
                return (
                  <div
                    key={b.id}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-500"
                  >
                    <Link
                      to={`/shop/${b.id}`}
                      className="block relative aspect-4/5 overflow-hidden"
                    >
                      <img
                        alt={b.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={
                          b.images?.[0]?.image ||
                          "https://picsum.photos/400/500?flower"
                        }
                      />
                      <button className="absolute top-4 right-4 size-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-lg">
                        <Heart size={20} />
                      </button>
                    </Link>
                    <div className="p-6">
                      <p className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] mb-2">
                        Bó Hoa Tươi
                      </p>
                      <Link to={`/shop/${b.id}`}>
                        <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-rose-500 transition-colors line-clamp-1">
                          {b.name}
                        </h4>
                      </Link>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-5 leading-relaxed">
                        {b.description}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xl font-black text-slate-900 tracking-tight">
                            {b.price.toLocaleString()}đ
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddToCart(b)}
                          className="size-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30 hover:bg-slate-900 transition-colors"
                        >
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="size-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-all disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`size-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${page === i ? "bg-rose-500 text-white shadow-lg" : "bg-white border border-slate-100 text-slate-600 hover:border-rose-500"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="size-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-all disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
