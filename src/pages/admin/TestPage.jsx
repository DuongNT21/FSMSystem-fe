import React from "react";
import { Sparkles } from "lucide-react";

const TestPage = () => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Chào buổi sáng"
      : hour < 18
        ? "Chào buổi chiều"
        : "Chào buổi tối";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 overflow-hidden">
      <div className="relative w-full max-w-3xl">
        {/* Floating blobs */}
        <div className="pointer-events-none absolute -top-16 -left-16 w-80 h-80 bg-rose-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 -right-10 w-40 h-40 bg-rose-300 rounded-full blur-2xl opacity-30 animate-[float_6s_ease-in-out_infinite]"></div>

        {/* Particle effect */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 left-10 w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
          <div className="absolute top-24 right-16 w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="absolute bottom-16 left-20 w-2 h-2 bg-rose-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>

        {/* Main card */}
        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 p-12 text-center transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-rose-400/30 rounded-full blur-xl animate-pulse"></div>
              <div className="w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center relative transition-transform duration-500 hover:scale-110">
                <Sparkles
                  className="text-rose-500 animate-[spin_8s_linear_infinite]"
                  size={40}
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 bg-clip-text text-transparent animate-fade-in">
            {greeting}, Admin ✨
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 mb-8 text-lg animate-fade-in [animation-delay:0.1s]">
            Chào mừng bạn quay trở lại hệ thống quản trị 🌸
          </p>

          {/* Divider */}
          <div className="w-20 h-1.5 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto rounded-full mb-8 animate-fade-in [animation-delay:0.2s]"></div>

          {/* Description */}
<p className="text-slate-500 max-w-xl mx-auto leading-relaxed animate-fade-in [animation-delay:0.3s]">
            Tại đây bạn có thể quản lý toàn bộ hệ thống: sản phẩm, đơn hàng,
            khách hàng và nhiều hơn nữa. Chúc bạn một ngày làm việc thật hiệu
            quả 🚀
          </p>
        </div>
      </div>

      {/* Custom animation */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(-10px); }
            50% { transform: translateY(10px); }
          }

          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default TestPage;