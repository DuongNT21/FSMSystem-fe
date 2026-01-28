import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { rawMaterialService } from "../../../services/rawMaterialService";

const RawMaterialDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await rawMaterialService.getRawMaterialById(id);
        const data = res?.data ?? res;
        setItem(data?.data ?? data);
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
          </div>
        )}
      </div>
    </div>
  );
};

export default RawMaterialDetail;
