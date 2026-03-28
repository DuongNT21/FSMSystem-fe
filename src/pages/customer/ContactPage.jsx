import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const ContactPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 mb-6">Liên Hệ</h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Chúng tôi luôn ở đây để lắng nghe và hỗ trợ bạn. Dù là một yêu cầu đặt hoa đặc biệt hay
              chỉ là một câu hỏi nhỏ, đừng ngần ngại gửi tin nhắn cho chúng tôi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">Địa chỉ</h4>
                <p className="text-slate-600">Số 123, Đường Láng, Quận Đống Đa, Hà Nội</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">Điện thoại</h4>
                <p className="text-slate-600">0123 456 789</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">Email</h4>
                <p className="text-slate-600">hello@flowershop.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-rose-500/5">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Họ và tên</label>
                <input
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all"
                  type="text"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Email</label>
                <input
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all"
                  type="email"
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Tin nhắn của bạn</label>
              <textarea
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all resize-none"
                rows="5"
                placeholder="Hãy cho chúng tôi biết bạn đang cần gì..."
              ></textarea>
            </div>
            <button className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/30 transform active:scale-[0.98]">
              <Send size={20} />
              GỬI TIN NHẮN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};