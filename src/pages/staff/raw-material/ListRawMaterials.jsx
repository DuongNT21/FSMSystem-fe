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
  Layers,
} from "lucide-react";
import { rawMaterialService } from "../../../services/rawMaterialService";
import { useAuth } from "../../../contexts/AuthContext";

const ListRawMaterials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const { user: currentUser } = useAuth();
  const isCurrentAdmin = currentUser?.roleName === "Admin";

  const fetchList = async () => {
    try {
      setLoading(true);
      const list = await rawMaterialService.getListRawMaterials();
      setItems(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // 1. Tính toán thống kê chi tiết
  const stats = useMemo(() => {
    return items.reduce((acc) => ({ totalTypes: acc.totalTypes + 1 }), {
      totalTypes: 0,
    });
  }, [items]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // 2. Xử lý lọc và sắp xếp
  const filtered = useMemo(() => {
    let data = [...items];
    const q = query.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.quantity.toString().includes(q),
      );
    }
    if (sortField) {
      data.sort((a, b) => {
        const x = a[sortField];
        const y = b[sortField];
        if (typeof x === "string") {
          return sortDir === "asc" ? x.localeCompare(y) : y.localeCompare(x);
        }
        return sortDir === "asc" ? x - y : y - x;
      });
    }
    return data;
  }, [items, query, sortField, sortDir]);

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center md:text-left">
          Quản Lý Kho Nguyên Liệu
        </h2>
        <p className="text-sm text-gray-500 text-center md:text-left">
          Theo dõi số lượng và giá trị tồn kho nguyên liệu hoa
        </p>
      </div>

      {/* --- BẢNG THỐNG KÊ CHI TIẾT --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Số loại nguyên liệu
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {stats.totalTypes} loại
            </p>
          </div>
        </div>
      </div>

      {/* THANH CÔNG CỤ */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
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
            placeholder="Tìm theo tên nguyên liệu..."
            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-sm"
          />
        </div>

        <Link
          to={isCurrentAdmin ? "/admin/raw-material/create" : "/staff/raw-material/create"}
          className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-lg transition-colors w-full md:w-auto font-semibold shadow-md active:scale-95"
        >
          <Plus size={18} /> Thêm mới nguyên liệu
        </Link>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="p-4 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100 select-none transition-colors"
                >
                  <div className="flex items-center">
                    Tên nguyên liệu <SortIcon field="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("quantity")}
                  className="p-4 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100 select-none transition-colors"
                >
                  <div className="flex items-center">
                    Số lượng <SortIcon field="quantity" />
                  </div>
                </th>
               
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-gray-500">
                    Không tìm thấy nguyên liệu nào khớp với tìm kiếm
                  </td>
                </tr>
              ) : (
                paged.map((it) => (
                  <tr
                    key={it.id}
                    className="hover:bg-rose-50/30 transition-colors"
                  >
                    <td className="p-4 text-sm text-gray-700 font-semibold">
                      {it.name}
                    </td>
                    <td className="p-4 text-sm text-gray-700 font-semibold">
                      {it.quantity}
                    </td>
                   
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PHÂN TRANG */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600 font-medium">
            Trang <span className="text-rose-600">{page}</span> / {totalPages}
          </div>
          <div className="flex gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-1.5 border border-gray-300 rounded-lg bg-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
            >
              Trước
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-1.5 border border-gray-300 rounded-lg bg-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListRawMaterials;
