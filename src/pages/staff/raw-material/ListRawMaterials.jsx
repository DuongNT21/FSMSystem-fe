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
} from "lucide-react";
import { rawMaterialService } from "../../../services/rawMaterialService";

const ListRawMaterials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const fetchList = async () => {
    try {
      setLoading(true);
      const list = await rawMaterialService.getListRawMaterials();
      setItems(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let data = [...items];
    const q = query.trim().toLowerCase();
    if (q) {
      data = data.filter((i) => (i.name || "").toLowerCase().includes(q));
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
        <h2 className="text-2xl font-bold text-gray-800">Nguyên liệu</h2>
        <p className="text-sm text-gray-500">
          Quản lý danh sách nguyên liệu trong kho
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
        <div className="relative w-full md:w-80">
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
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition-all"
          />
        </div>

        <Link
          to="/staff/raw-material/create"
          className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg transition-colors w-full md:w-40 font-medium shadow-sm"
        >
          <Plus size={18} /> Thêm mới
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                onClick={() => handleSort("name")}
                className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none transition-colors"
              >
                <div className="flex items-center">
                  Tên nguyên liệu <SortIcon field="name" />
                </div>
              </th>
              <th
                onClick={() => handleSort("quantity")}
                className="p-4 text-center text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none transition-colors"
              >
                <div className="flex items-center justify-center">
                  Số lượng <SortIcon field="quantity" />
                </div>
              </th>
              <th
                onClick={() => handleSort("importPrice")}
                className="p-4 text-center text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none transition-colors"
              >
                <div className="flex items-center justify-center">
                  Giá nhập <SortIcon field="importPrice" />
                </div>
              </th>
              <th className="p-4 text-center text-sm font-semibold text-gray-700">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="p-10 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-10 text-center text-gray-500">
                  Không tìm thấy nguyên liệu nào
                </td>
              </tr>
            ) : (
              paged.map((it) => (
                <tr
                  key={it.id}
                  className="hover:bg-rose-50/50 transition-colors"
                >
                  <td className="p-4 text-sm text-gray-700 font-medium">
                    {it.name}
                  </td>
                  <td className="p-4 text-center text-sm text-gray-600">
                    {it.quantity}
                  </td>
                  <td className="p-4 text-center text-sm text-gray-600 font-mono">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(it.importPrice)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      <Link
                        to={`/staff/raw-material/${it.id}`}
                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-md transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </Link>
                      <button
                        onClick={async () => {
                          if (!confirm("Xóa nguyên liệu này?")) return;
                          await rawMaterialService.deleteRawMaterial(it.id);
                          await fetchList();
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Xóa"
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

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Trang <strong>{page}</strong> trên <strong>{totalPages}</strong>
          </div>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded bg-white text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Trước
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded bg-white text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
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
