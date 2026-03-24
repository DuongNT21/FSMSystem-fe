import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { XCircle, RotateCcw } from "lucide-react";

const PaymentFailed = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
            <XCircle className="w-20 h-20 text-red-500 relative" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Thanh toán thất bại
        </h1>

        <p className="text-slate-600 mb-6">
          Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức
          khác.
        </p>

        {/* Order Info */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-slate-500 mb-1">Mã đơn hàng</p>
          <p className="font-bold text-slate-900 text-lg">#{orderId}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/cart")}
            className="w-full py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            Thanh toán lại <RotateCcw size={18} />
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-slate-100 text-slate-900 font-semibold rounded-xl hover:bg-slate-200 transition-all"
          >
            Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
