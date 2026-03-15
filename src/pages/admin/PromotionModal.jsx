import React, { useState, useEffect } from "react";
import { X, Save, Calendar, Tag, Percent, Info } from "lucide-react";
import { promotionApi } from "../../apis/flowerApi";

export const PromotionModal = ({ isOpen, onClose, promotion, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    discountValue: "",
    startDate: "",
    endDate: "",
    minOrderValue: 0,
    maxDiscountValue: 0,
    status: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (promotion) {
      setFormData({
        name: promotion.name || "",
        code: promotion.code || "",
        description: promotion.description || "",
        discountValue: promotion.discountValue || "",
        startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : "",
        endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : "",
        minOrderValue: promotion.minOrderValue || 0,
        maxDiscountValue: promotion.maxDiscountValue || 0,
        status: promotion.active || true
      });
    } else {
      // Default values for new promotion
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      setFormData({
        name: "",
        code: "",
        description: "",
        discountValue: "",
        startDate: today,
        endDate: nextWeek.toISOString().split('T')[0],
        minOrderValue: 0,
        maxDiscountValue: 0,
        status:  true
      });
    }
  }, [promotion]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, status: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        id: promotion?.id,
        discountValue: parseInt(formData.discountValue),
        minOrderValue: parseFloat(formData.minOrderValue),
        maxDiscountValue: parseFloat(formData.maxDiscountValue),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        status: formData.status,
      };

      if (promotion) {
        // In this specific API, update might be different, but following the pattern
        // If there's no update endpoint provided in spec, we might need to delete and recreate or use POST
        await promotionApi.update(payload); 
      } else {
        await promotionApi.create(payload);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving promotion:", error);
      alert("Lỗi khi lưu khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Tạo Khuyến Mãi Mới</h3>
            <p className="text-sm text-slate-500 mt-1">Thiết lập các thông số cho chương trình giảm giá của bạn.</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition-colors" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="px-8 py-8 overflow-y-auto">
          <form className="space-y-6" id="promotionForm" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Tên chương trình</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none" 
                placeholder="Ví dụ: Sale tưng bừng mùa Lễ hội" 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Mã khuyến mãi</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none uppercase" 
                    placeholder="VD: SUMMER24" 
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Phần trăm giảm giá (%)</label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none" 
                    placeholder="10" 
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="100"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Ngày bắt đầu</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none" 
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Ngày kết thúc</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none" 
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Mô tả khuyến mãi</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none resize-none" 
                placeholder="Nhập chi tiết về chương trình khuyến mãi..." 
                rows="2"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 flex gap-3">
              <Info className="text-rose-500 shrink-0" size={20} />
              <p className="text-xs text-rose-700 leading-relaxed font-medium">
                Khuyến mãi sẽ tự động kích hoạt vào ngày bắt đầu và kết thúc vào ngày hết hạn. Đảm bảo mã code là duy nhất.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-700">Trạng thái hoạt động</h4>
                <p className="text-xs text-slate-500 mt-0.5">Kích hoạt ngay chương trình sau khi tạo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked value={formData.status} onChange={handleInputChange} name = "status"/>
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>
          </form>
        </div>

        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-4">
          <button 
            className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors" 
            onClick={onClose}
            disabled={loading}
          >
            Hủy bỏ
          </button>
          <button 
            className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-500/20 transition-all transform active:scale-95 flex items-center gap-2 disabled:opacity-50" 
            type="submit"
            form="promotionForm"
            disabled={loading}
          >
            <Save size={18} />
            <span>{loading ? "Đang lưu..." : "Lưu Khuyến Mãi"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
