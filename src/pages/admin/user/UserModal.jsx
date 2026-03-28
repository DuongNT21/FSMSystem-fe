import React, { useState, useEffect } from "react";
import { X, Save, User, Mail, Phone, MapPin, Lock, Image as ImageIcon } from "lucide-react";
import { userService } from "../../../services/userService";
import { toast } from "react-toastify";

export const UserModal = ({ isOpen, onClose, staff, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        username: staff.username || "",
        email: staff.email || "",
        password: "",
        fullName: staff.fullName || "",
        phoneNumber: staff.phone || staff.phoneNumber || "",
        address: staff.address || "",
        avatar: staff.avatar || "",
      });
    } else {
      setFormData({
        username: "",
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        address: "",
        avatar: "",
      });
    }
  }, [staff]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (staff) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await userService.updateStaff(staff.id, payload);
        toast.success("Cập nhật nhân viên thành công");
      } else {
        await userService.createStaff(formData);
        toast.success("Tạo nhân viên thành công");
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi khi lưu thông tin");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">
            {staff ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên Mới"}
          </h3>
          <button className="text-slate-400 hover:text-slate-600 transition-colors" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form className="px-8 py-8 overflow-y-auto space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="username"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-500/20"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={!!staff}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  name="email"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-500/20"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Mật khẩu {staff && "(Để trống nếu không đổi)"}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="password"
                name="password"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-500/20"
                value={formData.password}
                onChange={handleInputChange}
                required={!staff}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Họ và tên</label>
            <input
              name="fullName"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-500/20"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="phoneNumber"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-500/20"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">URL Avatar</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="avatar"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-500/20"
                  value={formData.avatar}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Địa chỉ</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
              <textarea
                name="address"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-500/20 resize-none"
                rows="2"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              className="flex-1 px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-rose-500 text-white py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};