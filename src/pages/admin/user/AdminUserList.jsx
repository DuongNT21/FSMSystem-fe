import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { userService } from "../../../services/userService";
import { useAuth } from "../../../contexts/AuthContext";
import { UserModal } from "./UserModal";

export const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const { user: currentUser } = useAuth();
  const isCurrentAdmin = currentUser?.roleName === "Admin";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    username: "",
    phone: "",
    address: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        sort: "id,desc",
        ...filters,
      };
      
      // Filter out empty strings to avoid sending empty query params
      Object.keys(params).forEach(key => {
        if (params[key] === "") {
          delete params[key];
        }
      });

      const response = await userService.getUsers(params);
      
      if (response && response.data) {
        const { data, totalPages, total } = response.data;
        setUsers(data || []);
        setTotalPages(totalPages || 0);
        setTotalElements(total || 0);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleApplyFilters = () => {
    setPage(0);
    fetchUsers();
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      username: "",
      phone: "",
      address: "",
    });
    setPage(0);
    // Use timeout to ensure state update before fetching, or pass cleared filters directly
    setTimeout(() => {
        // We can't rely on state being updated immediately in this scope for the fetch
        // so we manually trigger a fetch with cleared values via a small workaround 
        // or just depend on the user clicking search again. 
        // Better UX: Trigger fetch immediately with cleared values.
        userService.getUsers({ page: 0, size: 10, sort: "id,desc" }).then(response => {
             if (response && response.data) {
                const { data, totalPages, total } = response.data;
                setUsers(data || []);
                setTotalPages(totalPages || 0);
                setTotalElements(total || 0);
             }
        });
    }, 0);
  };

  const handleToggleStatus = async (user) => {
    if (user.role === "Admin") return;

    const newStatus = !user.active;
    const actionText = newStatus ? "bỏ chặn" : "chặn";
    
    if (window.confirm(`Bạn có chắc chắn muốn ${actionText} người dùng ${user.username}?`)) {
      try {
        await userService.updateUserStatus(user.id, newStatus);
        toast.success(`Đã ${actionText} người dùng ${user.username}`);
        fetchUsers();
      } catch (error) {
        console.error(error);
        toast.error(`Lỗi khi ${actionText} người dùng`);
      }
    }
  };

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleEditStaff = (user) => {
    setSelectedStaff(user);
    setIsModalOpen(true);
  };

  const handleDeleteStaff = async (staffUser) => {
    if (window.confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN nhân viên ${staffUser.username}? Hành động này không thể hoàn tác.`)) {
      try {
        await userService.deleteStaff(staffUser.id);
        toast.success(`Đã xóa nhân viên ${staffUser.username}`);
        fetchUsers();
      } catch (error) {
        console.error(error);
        toast.error("Lỗi khi xóa nhân viên");
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý người dùng</h2>
        {isCurrentAdmin && (
          <button
            onClick={handleAddStaff}
            className="bg-rose-500 hover:opacity-90 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all transform active:scale-95"
          >
            <Plus size={18} />
            <span>Thêm Nhân Viên</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tên người dùng
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500 transition-colors"
                placeholder="Họ tên..."
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
              Username
            </label>
            <input
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500 transition-colors"
              placeholder="Username..."
              type="text"
              value={filters.username}
              onChange={(e) =>
                setFilters({ ...filters, username: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Số điện thoại
            </label>
            <input
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500 transition-colors"
              placeholder="09..."
              type="text"
              value={filters.phone}
              onChange={(e) =>
                setFilters({ ...filters, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Địa chỉ
            </label>
            <input
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500 transition-colors"
              placeholder="Địa chỉ..."
              type="text"
              value={filters.address}
              onChange={(e) =>
                setFilters({ ...filters, address: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClearFilters}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              Xóa
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-rose-500 text-white py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Tìm
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
                Avatar
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Thông tin
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Hành động
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
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-10 text-center text-slate-400"
                >
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isAdmin = user.role === "Admin";

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            alt={user.username}
                            className="w-full h-full object-cover"
                            src={user.avatar}
                          />
                        ) : (
                          <User className="text-slate-400" size={20} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">
                        {user.fullName || "N/A"}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        @{user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                        <Mail size={14} className="text-slate-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone size={14} className="text-slate-400" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-start gap-2 max-w-[200px]">
                        <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="truncate">{user.address || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          <Shield size={12} />
                          Admin
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.active ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isAdmin && (
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.active
                                ? "hover:bg-red-50 text-red-500"
                                : "hover:bg-green-50 text-green-500"
                            }`}
                            title={user.active ? "Chặn người dùng" : "Bỏ chặn người dùng"}
                          >
                            {user.active ? <Lock size={18} /> : <Unlock size={18} />}
                          </button>
                        )}
                        {isCurrentAdmin && user.role === "Staff" && (
                          <>
                            <button
                              onClick={() => handleEditStaff(user)}
                              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                              title="Chỉnh sửa nhân viên"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(user)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                              title="Xóa nhân viên"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
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
            Hiển thị {users.length > 0 ? page * 10 + 1 : 0} -{" "}
            {Math.min((page + 1) * 10, totalElements)} của {totalElements} kết quả
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
              {[...Array(totalPages)].map((_, i) => {
                 // Simple pagination logic to show limited pages if too many
                 if (totalPages > 7 && (i < page - 2 || i > page + 2) && i !== 0 && i !== totalPages - 1) {
                    if (i === page - 3 || i === page + 3) return <span key={i} className="text-slate-400 text-xs px-1">...</span>;
                    return null;
                 }
                 return (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-8 h-8 flex items-center justify-center rounded font-bold text-sm transition-all ${
                        page === i
                          ? "bg-rose-500 text-white shadow-md"
                          : "border border-slate-200 hover:bg-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                 );
              })}
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
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          staff={selectedStaff}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};
