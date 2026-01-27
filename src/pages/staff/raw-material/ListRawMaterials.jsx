import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import { rawMaterialService } from "../../../services/rawMaterialService";

const ListRawMaterials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await rawMaterialService.getListRawMaterials();
      const data = res?.data ?? res;
      setItems(Array.isArray(data) ? data : data?.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Nguyên liệu</h2>
        <Link
          to="/staff/raw-material/create"
          className="inline-flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600"
        >
          <Plus className="w-4 h-4" /> Thêm nguyên liệu
        </Link>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Tên</th>
              <th className="text-left px-4 py-3">Số lượng</th>
              <th className="text-left px-4 py-3">Giá nhập</th>
              <th className="text-left px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  Không có nguyên liệu
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="px-4 py-3">{it.name}</td>
                  <td className="px-4 py-3">{it.quantity}</td>
                  <td className="px-4 py-3">{it.importPrice}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/staff/raw-material/${it.id}`}
                      className="inline-flex items-center gap-2 text-rose-500 hover:underline"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" /> Xem
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRawMaterials;
