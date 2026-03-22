import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  Package,
  MapPin,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  CheckSquare,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { orderService } from "../../services/orderService";
import { toast } from "react-toastify";

const STATUS_TRANSITIONS = {
  pending: [],
  accepted: ["Done"],
  done: [],
  cancelled: [],
};

const OrderPage = ({ isAdmin = false }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [pendingStatus, setPendingStatus] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const statusConfig = {
    pending: {
      label: "Chờ xử lý",
      color: "bg-amber-50 text-amber-600 border-amber-100",
      icon: <Clock size={14} />,
    },
    accepted: {
      label: "Đã xác nhận",
      color: "bg-blue-50 text-blue-600 border-blue-100",
      icon: <CheckSquare size={14} />,
    },
    done: {
      label: "Hoàn thành",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      icon: <CheckCircle2 size={14} />,
    },
    cancelled: {
      label: "Đã hủy",
      color: "bg-red-50 text-red-600 border-red-100",
      icon: <AlertCircle size={14} />,
    },
  };

  const allStatuses = ["all", "pending", "accepted", "done", "cancelled"];
  const adminStatuses = ["all", "accepted", "done"];

  useEffect(() => {
    fetchOrders();
  }, [isAdmin, filterStatus, fromDate, toDate]);

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const params = {
        status: filterStatus === "all" ? undefined : filterStatus,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      };
      const data = await orderService.getListOrders(params);
      setOrders(data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleRowClick = async (order) => {
    try {
      setLoadingDetail(true);
      const detail = await orderService.getOrderById(order.id);
      setSelectedOrder(detail);
      setPendingStatus("");
    } catch (error) {
      toast.error("Không thể tải chi tiết đơn hàng");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!isAdmin || !selectedOrder || !pendingStatus) return;
    try {
      await orderService.updateOrderStatus(selectedOrder.id, pendingStatus);
      toast.success(`Cập nhật đơn hàng #${selectedOrder.id} thành công`);
      setSelectedOrder({
        ...selectedOrder,
        status: pendingStatus.toLowerCase(),
      });
      setPendingStatus("");
      fetchOrders(true);
    } catch (error) {
      toast.error("Cập nhật thất bại");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {isAdmin && <ShieldCheck className="text-rose-500" size={20} />}
              <span className="text-rose-500 font-bold text-sm uppercase tracking-widest">
                {isAdmin ? "Admin Panel" : "Customer Portal"}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">
              {isAdmin ? "Quản Lý Đơn Hàng" : "Đơn Hàng Của Bạn"}
            </h1>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {(isAdmin ? adminStatuses : allStatuses).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  filterStatus === status
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {status === "all" ? "Tất cả" : statusConfig[status]?.label}
              </button>
            ))}
          </div>

          {/* Date Picker Group */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
              />
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
              />
            </div>
            {(fromDate || toDate) && (
              <button
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
                className="ml-2 p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Content View */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 font-medium text-slate-400">
            Không tìm thấy đơn hàng nào trong khoảng thời gian này.
          </div>
        ) : isAdmin ? (
          /* TABLE VIEW FOR ADMIN */
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold">
                <tr>
                  <th className="p-4">MÃ ĐƠN</th>
                  <th className="p-4">KHÁCH HÀNG</th>
                  <th className="p-4">TỔNG TIỀN</th>
                  <th className="p-4">TRẠNG THÁI</th>
                  <th className="p-4 text-right">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 font-bold">#{order.id}</td>
                    <td className="p-4 font-semibold text-slate-700">
                      {order.fullName}
                    </td>
                    <td className="p-4 font-black text-rose-500">
                      {order.totalPrice.toLocaleString()}₫
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${statusConfig[(order.status || "pending").toLowerCase()]?.color}`}
                      >
                        {
                          statusConfig[
                            (order.status || "pending").toLowerCase()
                          ]?.icon
                        }{" "}
                        {
                          statusConfig[
                            (order.status || "pending").toLowerCase()
                          ]?.label
                        }
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleRowClick(order)}
                        className="text-xs font-bold bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:bg-rose-500 transition-all"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* TABLE VIEW FOR USER */
          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleRowClick(order)}
                className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-rose-200 cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Đơn hàng #{order.id}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tổng: {order.totalPrice.toLocaleString()}₫
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${statusConfig[(order.status || "pending").toLowerCase()]?.color}`}
                  >
                    {
                      statusConfig[(order.status || "pending").toLowerCase()]
                        ?.label
                    }
                  </span>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">
                  Chi Tiết Đơn #{selectedOrder.id}
                </h2>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    setPendingStatus("");
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Người nhận
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {selectedOrder.fullName}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Điện thoại
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {selectedOrder.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium text-slate-600">
                    <MapPin
                      size={14}
                      className="inline mr-2 mb-1 text-slate-400"
                    />
                    {selectedOrder.deliveryAddress}
                  </div>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden">
                    {selectedOrder.orderItems?.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 flex justify-between border-b border-slate-50 last:border-0 text-sm"
                      >
                        <span className="font-bold">
                          {item.bouquetName}{" "}
                          <span className="text-slate-400 font-medium">
                            x{item.quantity}
                          </span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {(item.price * item.quantity).toLocaleString()}₫
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl flex flex-col gap-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Trạng thái đơn hàng
                  </p>
                  {isAdmin ? (
                    (() => {
                      const currentKey = (
                        selectedOrder.status || "pending"
                      ).toLowerCase();
                      const allowedNext = STATUS_TRANSITIONS[currentKey] ?? [];
                      return (
                        <>
                          <div className="p-3 rounded-xl text-xs font-bold flex justify-between items-center border-2 bg-white border-rose-500 text-rose-500 shadow-sm">
                            {statusConfig[currentKey]?.label ??
                              selectedOrder.status}
                            <CheckCircle2 size={14} />
                          </div>
                          {allowedNext.length > 0 ? (
                            <>
                              <select
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-none cursor-pointer"
                                value={pendingStatus}
                                onChange={(e) =>
                                  setPendingStatus(e.target.value)
                                }
                              >
                                <option value="">
                                  -- Chọn trạng thái mới --
                                </option>
                                {allowedNext.map((s) => (
                                  <option key={s} value={s}>
                                    {statusConfig[s.toLowerCase()]?.label ?? s}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={handleUpdateStatus}
                                disabled={!pendingStatus}
                                className="w-full py-2.5 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-40 transition-all"
                              >
                                Xác nhận cập nhật
                              </button>
                            </>
                          ) : (
                            <p className="text-[10px] text-slate-400 italic text-center">
                              Đơn hàng đã kết thúc
                            </p>
                          )}
                        </>
                      );
                    })()
                  ) : (
                    <div
                      className={`p-4 rounded-xl border-2 text-center font-bold uppercase text-xs ${statusConfig[(selectedOrder.status || "pending").toLowerCase()]?.color}`}
                    >
                      {
                        statusConfig[
                          (selectedOrder.status || "pending").toLowerCase()
                        ]?.label
                      }
                    </div>
                  )}
                  <div className="mt-auto pt-4 border-t border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                      Thanh toán
                    </p>
                    <p className="text-2xl font-black text-rose-500">
                      {selectedOrder.totalPrice?.toLocaleString()}₫
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {loadingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
