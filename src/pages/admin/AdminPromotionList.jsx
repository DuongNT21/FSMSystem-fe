import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Tag, Calendar, Percent } from "lucide-react";
import { promotionApi } from "../../apis/flowerApi";
import { PromotionModal } from "./PromotionModal";

export const AdminPromotionList = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await promotionApi.getAll({
        page,
        size: 10,
        keyword
      });
      if (response && response.data) {
        setPromotions(response.data.data || []);
        setTotalPages(response.data.totalPages || 0);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(true); // Keep loading state for a bit to show transition
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [page, keyword]);

  const handleCreate = () => {
    setSelectedPromotion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (promo) => {
    setSelectedPromotion(promo);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
      try {
        await promotionApi.delete(id);
        fetchPromotions();
      } catch (error) {
        alert("Lỗi khi xóa khuyến mãi");
      }
    }
  };

  // Filter logic for UI (since API might not support status filter directly in the same way)
  const filteredPromotions = promotions.filter(p => {
    if (statusFilter === "all") return true;
    const now = new Date();
    const end = new Date(p.endDate);
    if (statusFilter === "active") return now <= end;
    if (statusFilter === "expired") return now > end;
    return true;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Khuyến mãi</h2>
          <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span className="text-rose-500">Khuyến mãi</span>
          </div>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all transform active:scale-95"
        >
          <Plus size={18} />
          <span>TẠO KHUYẾN MÃI</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            <button 
              onClick={() => setStatusFilter("all")}
              className={`flex-1 md:flex-none px-6 py-2 text-sm font-bold rounded-lg transition-all ${statusFilter === 'all' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setStatusFilter("active")}
              className={`flex-1 md:flex-none px-6 py-2 text-sm font-bold rounded-lg transition-all ${statusFilter === 'active' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Đang chạy
            </button>
            <button 
              onClick={() => setStatusFilter("expired")}
              className={`flex-1 md:flex-none px-6 py-2 text-sm font-bold rounded-lg transition-all ${statusFilter === 'expired' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Hết hạn
            </button>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-rose-500 focus:border-rose-500 transition-all outline-none" 
              placeholder="Tìm theo tên hoặc mã..." 
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tên khuyến mãi</th>
              <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Giảm giá %</th>
              <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thời gian</th>
              <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
              <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-8 py-12 text-center text-slate-400">Đang tải dữ liệu...</td>
              </tr>
            ) : filteredPromotions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-12 text-center text-slate-400">Không tìm thấy khuyến mãi nào.</td>
              </tr>
            ) : (
              filteredPromotions.map((p) => {
                const now = new Date();
                const start = new Date(p.startDate);
                const end = new Date(p.endDate);
                let status = { label: 'ACTIVE', color: 'bg-green-100 text-green-600', dot: 'bg-green-500' };
                
                if (now < start) {
                  status = { label: 'UPCOMING', color: 'bg-blue-100 text-blue-600', dot: 'bg-blue-500' };
                } else if (now > end) {
                  status = { label: 'EXPIRED', color: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' };
                }

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-800 group-hover:text-rose-500 transition-colors">{p.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-1 tracking-widest uppercase">CODE: {p.code}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-rose-500 font-black text-xl">{p.discountValue}%</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm text-slate-600 font-medium">
                        {new Date(p.startDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">đến {new Date(p.endDate).toLocaleDateString('vi-VN')}</div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${status.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(p)}
                          className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all" 
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2.5 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-500 transition-all" 
                          title="Xóa"
                        >
                          <Trash2 size={18} />
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
        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400">Hiển thị {filteredPromotions.length} của {total} khuyến mãi</p>
          <div className="flex gap-2">
            <button 
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-white transition-all disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs transition-all ${page === i ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'border border-slate-200 hover:bg-white text-slate-600'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-white transition-all disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <PromotionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          promotion={selectedPromotion}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchPromotions();
          }}
        />
      )}
    </div>
  );
};
